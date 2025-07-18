require("dotenv").config();
const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 3000; // Fixed order - process.env.PORT first
const app = express();

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
