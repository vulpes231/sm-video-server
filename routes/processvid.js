const { apiLimiter } = require("../middlewares/rateLimit");

const {
	processVideo,
	clientDownload,
} = require("../handlers/processVideoController");
const { validateVideoRequest } = require("../middlewares/validate");

const express = require("express");
const router = express.Router();

router.post("/", apiLimiter, validateVideoRequest, processVideo);
router.get("/file", clientDownload);

module.exports = router;
