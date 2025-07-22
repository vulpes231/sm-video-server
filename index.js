require("dotenv").config();
const express = require("express");
const cors = require("cors");

const fs = require("fs");

// Ensure yt-dlp is executable on startup
if (!fs.existsSync("./yt-dlp")) {
	console.error("Error: yt-dlp not found. Did the postinstall script run?");
} else {
	fs.chmodSync("./yt-dlp", 0o755); // Ensure execute permissions
}

const PORT = process.env.PORT || 3000;
const app = express();

// Configure Express to trust proxies (add this line)
app.set("trust proxy", ["loopback", "linklocal", "uniquelocal"]);

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import the router
const rootRouter = require("./routes/root");
const processVideoRouter = require("./routes/processvid");

// Mount the router
app.use("/", rootRouter);
app.use("/process", processVideoRouter);

app.listen(PORT, () =>
	console.log(`Server started on http://localhost:${PORT}`)
);
