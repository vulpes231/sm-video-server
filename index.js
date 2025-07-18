require("dotenv").config();
const express = require("express");
const cors = require("cors");

const PORT = 3000 || process.env.PORT;
const app = express();

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", require("./routes/root"));

app.listen(PORT, () =>
	console.log(`Server started on http://localhost:${PORT}`)
);
