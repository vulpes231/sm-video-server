const { processVideo } = require("../handlers/processVideoController");
const { validateVideoRequest } = require("../middlewares/validate");

const express = require("express");
const router = express.Router();

router.post("/", validateVideoRequest, processVideo);

module.exports = router;
