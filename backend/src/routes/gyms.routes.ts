import { Router, Request, Response } from "express";
import { searchGyms, addGym } from "../db/database.js"; 

const router = Router();

// Existing search route
router.get("/", async (req: Request, res: Response) => {
  try {
    const city = String(req.query.city || "").trim();
    const results = await searchGyms(city);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching gyms" });
  }
});

// POST route to accept new gym entries from the admin form
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, city } = req.body;

    if (!name || !city || !name.trim() || !city.trim()) {
      res.status(400).json({ success: false, message: "Name and city are required." });
      return;
    }

    await addGym(name.trim(), city.trim());
    res.status(201).json({ success: true, message: "Gym created successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating gym" });
  }
});

export default router;