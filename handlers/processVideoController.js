const { getDownloadableUrl } = require("../utils/utils");
const axios = require("axios");

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

async function clientDownload(req, res) {
	const { url } = req.query;
	if (!url) {
		return res.status(400).send("Missing URL");
	}

	try {
		const response = await axios({
			method: "get",
			url,
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
				Accept: "*/*",
				Referer: "https://x.com/",
			},
			responseType: "stream",
		});

		res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
		res.setHeader("Content-Type", "video/mp4");

		response.data.pipe(res);
	} catch (error) {
		console.error("Download proxy failed:", error.message);
		res.status(500).send("Download failed");
	}
}

module.exports = {
	processVideo,
	clientDownload,
};
