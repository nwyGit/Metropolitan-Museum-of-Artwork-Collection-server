/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Wai Yan Ng Student ID: 149637217 Date: 11 Jan 2023
 *  Cyclic Link: https://itchy-slippers-clam.cyclic.app/
 *********************************************************************************/

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
app.get("/", (req, res) => {
	res.json({ message: "API Listening" });
});

// Create one
app.post("/api/movies", (req, res) => {
	db.addNewMovie(req.body)
		.then((newObj) => {
			res.status(201).json(newObj);
		})
		.catch(() => {
			res.status(500).json({ message: "Failed to create an object" });
		});
});

// Get all
app.get("/api/movies", (req, res) => {
	db.getAllMovies(
		parseInt(req.query.page),
		parseInt(req.query.perPage),
		req.query.title
	)
		.then((results) => {
			res.json(results);
		})
		.catch((err) => {
			res.status(500).json({ message: err.message });
		});
});

// Get one
app.get("/api/movies/:id", (req, res) => {
	db.getMovieById(req.params.id)
		.then((result) => {
			res.json(result);
		})
		.catch(() => {
			res.status(500).json({
				message: `Failed to find the object with ID ${req.params.id}`,
			});
		});
});

// Update one
app.put("/api/movies/:id", (req, res) => {
	db.updateMovieById(req.body, req.params.id)
		.then(() => {
			res.json(db.getMovieById(rep.params.id));
		})
		.catch(() => {
			res.status(500).json({
				message: `Failed to update the object with ID ${req.params.id}`,
			});
		});
});

// Delete one
app.delete("/api/movies/:id", (req, res) => {
	db.deleteMovieById(req.params.id)
		.then(() => {
			res.status(204).end();
		})
		.catch(() => {
			res.status(500).json({
				message: `Failed to delete the object with ID ${req.params.id}`,
			});
		});
});

// Resource not found / Exception routes
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
