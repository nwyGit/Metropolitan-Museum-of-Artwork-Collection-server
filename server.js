const express = require("express");
const path = require("path");
const cors = require("cors");
const exp = require("constants");
const dotenv = require("dotenv").config();
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const MoviesDB = require("./modules/mongoDB.js");
const db = new MoviesDB();

// middleware

app.use(cors());
app.use(express.json());

// Routes
// Get all
app.get("/", (req, res) => {
	res.json({ message: "API listening" });
});

// Resource not found
app.use((req, res) => {
	res.status(404).send("Resource not found");
});

// Start listening requests
db.initialize(process.env.MONGODB_CONN_STRING)
	.then(() => {
		app.listen(HTTP_PORT, () => {
			console.log(`server listening on: ${HTTP_PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
