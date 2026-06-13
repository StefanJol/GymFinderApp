import { Router, Request, Response } from "express";
import { searchGyms } from "../db/database.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const city = String(req.query.city || "").trim();
    const results = await searchGyms(city);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching gyms" });
  }
});

export default router;