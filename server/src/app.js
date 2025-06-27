const express = require("express");
const app = express();
const PORT = 8080;
const knex = require("knex")(require("../knexfile.js")["development"]);
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.send("Application up and running");
});

app.get("/list", (req, res) => {
  knex("list_table")
    .select("*")
    .then((list) => res.status(200).json(list))
    .catch((err) =>
      res.status(500).json({
        message: "There was a problem fetching the list",
        error: err.message,
      })
    );
});

app.get("/list/:id", (req, res) => {
  let id = req.params.id;
  knex("list_table")
    .select("*")
    .where("id", id)
    .then((list) => res.status(200).json(list))
    .catch((err) =>
      res.status(500).json({
        message: "There was a problem fetching the list item with that id",
        error: err.message,
      })
    );
});

app.get("/list/search/:searchterm", (req, res) => {
  let searchterm = req.params.searchterm;
  knex("list_table")
    .select("*")
    .whereILike("name", `%${searchterm}%`)
    .orWhereILike("comments", `%${searchterm}%`)
    .then((list) => res.status(200).json(list))
    .catch((err) =>
      res.status(500).json({
        message: "Could not find anything",
        error: err.message,
      })
    );
});

app.post("/list", (req, res) => {
  const { name, comments, completed } = req.body;
  knex("list_table")
    .insert({ name, comments, completed })
    .then(() =>
      res.status(201).json({ message: "List item added successfully." })
    )
    .catch((err) =>
      res
        .status(500)
        .json({ message: "List item could not be added", error: err.message })
    );
});

app.patch("/list/:id", (req, res) => {
  let id = req.params.id;
  const { name, comments, completed } = req.body;
  knex("list_table")
    .where("id", id)
    .update({ name, comments, completed })
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: `Item with ID ${id} updated successfully`,
        });
      } else {
        res.status(404).json({ error: "Item not found" });
      }
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "List item could not be updated", error: err.message })
    );
});

app.delete("/list/:id", (req, res) => {
  let id = req.params.id;
  knex("list_table")
    .where("id", id)
    .del()
    .then(() =>
      res.status(201).json({ message: "List item deleted successfully." })
    )
    .catch((err) =>
      res
        .status(500)
        .json({ message: "List item could not be deleted", error: err.message })
    );
});

const server = app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

module.exports = { app, server, PORT };
