const axios = require("axios");
const { exec } = require("child_process");
const express = require("express");

// Add this new router for download proxy
const downloadRouter = express.Router();

// Modified processVideoController.js
const processVideo = async (req, res) => {
	const { url, platform } = req.body;

	try {
		const result = await getDownloadableUrl(url, platform, req.isMobile);

		res.status(200).json({
			success: true,
			downloadOptions: {
				directUrl: result.directUrl,
				// Change to use download endpoint instead of proxy
				downloadUrl: `/download/file?url=${encodeURIComponent(
					result.directUrl
				)}&platform=${platform}`,
				meta: result.meta,
			},
			...(req.isMobile && {
				userAgentHint: "Long-press the download link",
			}),
		});
	} catch (error) {
		console.error("Download error:", error);
		res.status(500).json({
			message: "Download failed",
			error: error.message,
		});
	}
};

// New endpoint to force download
downloadRouter.get("/file", async (req, res) => {
	try {
		const videoUrl = decodeURIComponent(req.query.url);
		const platform = req.query.platform;

		// Set download headers
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="${platform}-video.mp4"`
		);
		res.setHeader("Content-Type", "video/mp4");

		// Stream the video
		const response = await axios.get(videoUrl, { responseType: "stream" });
		response.data.pipe(res);
	} catch (error) {
		console.error("Download failed:", error);
		res.status(500).send("Download failed");
	}
});

// Keep your existing helper functions
async function getDownloadableUrl(url, platform, isMobile) {
	if (isMobile && platform === "instagram") {
		return await getMobileInstagramUrl(url);
	}
	return {
		directUrl: await downloadWithYtDlp(url),
		meta: { recommendedForMobile: isMobile },
	};
}

async function getMobileInstagramUrl(url) {
	const response = await axios.get(
		`https://api.example.com/ig?url=${encodeURIComponent(url)}`
	);
	return {
		directUrl: response.data.videoUrl,
		meta: { isMobileOptimized: true },
	};
}

async function downloadWithYtDlp(url) {
	return new Promise((resolve, reject) => {
		exec(`yt-dlp -g --no-check-certificate ${url}`, (error, stdout) => {
			error ? reject(error) : resolve(stdout.trim());
		});
	});
}

module.exports = {
	processVideo,
	downloadRouter, // Export the new router
};
