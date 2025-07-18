const validateVideoRequest = (req, res, next) => {
	req.isMobile = /mobile|android|iphone|ipad/i.test(req.headers["user-agent"]);

	if (!req.body.url) {
		return res.status(400).json({ error: "Video URL is required" });
	}

	try {
		new URL(req.body.url);
	} catch {
		return res.status(400).json({ error: "Invalid URL format" });
	}

	next();
};

module.exports = { validateVideoRequest };
