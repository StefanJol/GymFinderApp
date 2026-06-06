import express from "express";
import cors from "cors";
import { createUser, authUser } from "./db/database.js";

const app = express();


app.use(cors());
app.use(express.json());

app.post("/users/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await createUser(username, email, password);
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Database insertion failed" });
  }
});

const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running cleanly on port ${PORT}`);
});