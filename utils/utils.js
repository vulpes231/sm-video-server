const { exec } = require("child_process");

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
	// Replace x.com with twitter.com
	const normalizedUrl = url.replace("x.com", "twitter.com");

	return new Promise((resolve, reject) => {
		exec(
			`yt-dlp -g --no-check-certificate ${normalizedUrl}`,
			(error, stdout) => {
				error ? reject(error) : resolve(stdout.trim());
			}
		);
	});
}

module.exports = {
	getDownloadableUrl,
	getMobileInstagramUrl,
	downloadWithYtDlp,
};
