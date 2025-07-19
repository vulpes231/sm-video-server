const { processVideo } = require("../handlers/processVideoController");
const { validateVideoRequest } = require("../middlewares/validate");

const express = require("express");
const router = express.Router();
const axios = require("axios");

// Main video processing endpoint
router.post("/", validateVideoRequest, processVideo);

router.get("/file", async (req, res) => {
	console.log("Download route hit:", req.query.url);

	const { url } = req.query;
	if (!url) {
		return res.status(400).send("Missing URL");
	}

	try {
		const response = await axios({
			method: "get",
			url,
			responseType: "stream",
		});

		res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
		res.setHeader("Content-Type", "video/mp4");

		response.data.pipe(res);
	} catch (error) {
		console.error("Download proxy failed:", error.message);
		res.status(500).send("Download failed");
	}
});

module.exports = router;
