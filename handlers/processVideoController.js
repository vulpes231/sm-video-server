const axios = require("axios");
const fs = require("fs");
const { exec } = require("child_process");
const supportedPlatforms = ["facebook", "instagram", "x"];

const processVideo = async (req, res) => {
	const { url, platform } = req.body;

	if (!url) return res.status(400).json({ message: "Video URL required!" });

	try {
		// Determine platform
		const detectedPlatform = detectPlatform(url, platform);

		// Get download URL
		const result = await getDownloadableUrl(url, detectedPlatform);

		// For mobile-friendly response
		res.status(200).json({
			success: true,
			platform: detectedPlatform,
			downloadOptions: {
				directUrl: result.directUrl,
				proxyUrl: `/download/proxy?url=${encodeURIComponent(result.directUrl)}`, // Safer for mobile
				meta: result.meta,
			},
			userAgentHint: "On mobile, long-press the link or use the proxy URL",
		});
	} catch (error) {
		console.error("Mobile download error:", error);
		res.status(500).json({
			message: "Download failed",
			mobileSpecificHint: "Try copying the link and opening in browser",
			error: error.message,
		});
	}
};

function detectPlatform(url, specifiedPlatform) {
	if (specifiedPlatform) return specifiedPlatform.toLowerCase();

	if (/instagram\.com|instagr\.am/i.test(url)) return "instagram";
	if (/facebook\.com|fb\.watch/i.test(url)) return "facebook";
	if (/twitter\.com|x\.com/i.test(url)) return "x";

	throw new Error("Unsupported URL");
}

// Mobile-optimized download handler
async function getDownloadableUrl(url, platform) {
	const isMobileUserAgent = /mobile|android|iphone|ipad/i.test(
		req.headers["user-agent"]
	);

	if (isMobileUserAgent && platform === "instagram") {
		return await getMobileInstagramUrl(url);
	}

	return {
		directUrl: await downloadWithYtDlp(url),
		meta: { recommendedForMobile: false },
	};
}

module.exports = { processVideo, supportedPlatforms };
