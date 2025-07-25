const { exec } = require("child_process");
const axios = require("axios");
const NodeCache = require("node-cache");
const fs = require("fs");

const videoCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

function normalizeTwitterUrl(url) {
	return url.replace("x.com", "twitter.com");
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
	const normalizedUrl = normalizeTwitterUrl(url);

	const command = fs.existsSync("./yt-dlp") ? "./yt-dlp" : "yt-dlp";

	return new Promise((resolve, reject) => {
		exec(
			`${command} -g --no-check-certificate "${normalizedUrl}"`,
			(error, stdout, stderr) => {
				if (error) {
					console.error("yt-dlp error:", stderr);
					reject(error);
				} else {
					resolve(stdout.trim());
				}
			}
		);
	});
}

async function getDownloadableUrl(url, platform, isMobile) {
	const cacheKey = `${platform}:${url}`;
	const cached = videoCache.get(cacheKey);

	if (cached) {
		console.log("✅ Cache hit for:", cacheKey);
		return cached;
	}

	if (isMobile && platform === "instagram") {
		const result = await getMobileInstagramUrl(url);
		videoCache.set(cacheKey, result);
		return result;
	}

	try {
		const directUrl = await downloadWithYtDlp(url);
		const result = {
			directUrl,
			meta: { from: "yt-dlp", recommendedForMobile: isMobile },
		};
		videoCache.set(cacheKey, result);
		return result;
	} catch (ytError) {
		console.warn(
			"⚠️ yt-dlp failed, falling back to direct proxy:",
			ytError.message
		);

		const fallback = {
			directUrl: normalizeTwitterUrl(url),
			meta: { from: "fallback", recommendedForMobile: isMobile },
		};
		videoCache.set(cacheKey, fallback);
		return fallback;
	}
}

module.exports = {
	getDownloadableUrl,
	getMobileInstagramUrl,
	downloadWithYtDlp,
	normalizeTwitterUrl,
	videoCache,
};
