const {
	processVideo,
	downloadRouter,
} = require("../handlers/processVideoController");
const { validateVideoRequest } = require("../middlewares/validate");

const express = require("express");
const router = express.Router();

// Main video processing endpoint
router.post("/", validateVideoRequest, processVideo);

// Add download routes
router.use("/download", downloadRouter);

module.exports = router;
