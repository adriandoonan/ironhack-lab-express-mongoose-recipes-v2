const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const Recipe = require("./models/Recipe.model");

const app = express();

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());

// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION

const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev";

mongoose
	.connect(MONGODB_URI)
	.then((x) =>
		console.log(
			`Connected to Mongo! Database name: "${x.connections[0].name}"`,
		),
	)
	.catch((err) => console.error("Error connecting to mongo", err));

// ROUTES
//  GET  / route - This is just an example route
app.get("/", (req, res) => {
	res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});

//  Iteration 3 - Create a Recipe route
//  POST  /recipes route

app.post("/recipes", (req, res) => {
	const body = req.body;
	console.log(body);
	Recipe.create(body)
		.then((createdRecipe) => {
			console.log("created", createdRecipe);
			res.status(201).json(createdRecipe);
		})
		.catch((err) => {
			console.error("there was an error adding a recipe", err);
			res.status(500).json({ error: "Failed to create the recipe" });
		});
});

//  Iteration 4 - Get All Recipes
//  GET  /recipes route

app.get("/recipes", (req, res) => {
	Recipe.find({})
		.then((recipes) => {
			console.log("got some recipes");
			res.status(200).json(recipes);
		})
		.catch((err) => {
			console.error("had an error getting recipes", err);
			res.status(500).json({ error: "Failed to get recipes" });
		});
});

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route

app.get("/recipes/:recipeId", (req, res) => {
	const { recipeId } = req.params;
	Recipe.findById(recipeId)
		.then((recipe) => {
			console.log("got recipe", recipe);
			res.status(200).json(recipe);
		})
		.catch((err) => {
			console.error("had an error getting that recipe", err, "\n\n");
			res.status(500).json({ error: "had a whoopsie", message: err.message });
		});
});

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route

app.put("/recipes/:recipeId", (req, res) => {
	const { recipeId } = req.params;
	const body = req.body;
	console.log(body);
	Recipe.findByIdAndUpdate(recipeId, body, { returnDocument: "after" })
		.then((recipe) => {
			console.log("got recipe", recipe._id);
			res.status(200).json(recipe);
		})
		.catch((err) => {
			console.error("had an error getting that recipe", err, "\n\n");
			res.status(500).json({ error: "had a whoopsie", message: err.message });
		});
});

//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route

app.delete("/recipes/:recipeId", (req, res) => {
	const { recipeId } = req.params;
	Recipe.findByIdAndDelete(recipeId)
		.then((recipe) => {
			console.log("deleted recipe", recipe._id);
			res.status(200).json({ deleted: recipe });
		})
		.catch((err) => {
			console.error("had an error deleting that recipe", err, "\n\n");
			res.status(500).json({ error: "had a whoopsie", message: err.message });
		});
});

// Start the server
app.listen(3000, () => console.log("My first app listening on port 3000!"));

//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
