const axios = require("axios");
const { exec } = require("child_process");

const processVideo = async (req, res) => {
	const { url, platform } = req.body;

	try {
		const result = await getDownloadableUrl(url, platform, req.isMobile);

		res.status(200).json({
			success: true,
			downloadOptions: {
				directUrl: result.directUrl,
				downloadUrl: `/process/file?url=${encodeURIComponent(
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
};
