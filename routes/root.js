// routes/root.js
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	try {
		res.status(200).json({ message: "Welcome to video downloader" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server down!" });
	}
});

router.get("/health", async (req, res) => {
	try {
		res.status(200).json({ health: "UP 100%" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server down!" });
	}
});

module.exports = router;
