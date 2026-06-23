import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createUser, authUser } from "./db/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// serve frontend
// tells express to look inside dist
const reactBuildPath = path.join(__dirname, "./dist"); 
app.use(express.static(reactBuildPath));

// existin g api routes
app.post("/users/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await createUser(username, email, password);
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Database insertion failed" });
  }
});

// catch routes for react routere
app.get("*", (req, res) => {
  res.sendFile(path.join(reactBuildPath, "index.html"));
});

// start server
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is serving BOTH Frontend and Backend cleanly on port ${PORT}`);
});