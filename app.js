const express = require("express");
const dotenv = require("dotenv");
const { Pool } = require("pg");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5005;

// Parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Routes
// CRUD = Create, Read, Update, Delete
// GET
app.get("/users", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching users: ", error); // Log the error
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CREATE
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error("Error inserting user: ", error); // Log the error
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT update user
app.put("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;
    const { rows } = await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating user: ", error); // Log the error
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE
app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ msg: "User deleted!" });
  } catch (error) {
    console.error("Error deleting user: ", error); // Log the error
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
