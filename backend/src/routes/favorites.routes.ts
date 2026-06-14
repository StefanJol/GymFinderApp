import { Router, Request, Response } from "express";
import { addFavorite, getFavorites, removeFavorite } from "../db/database.js";

const router = Router();

// Add a gym to favorites
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, gymId } = req.body;
    await addFavorite(Number(userId), Number(gymId));
    res.status(201).json({ success: true, message: "Gym bookmarked" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error bookmarking gym" });
  }
});

// Get users favorites
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const results = await getFavorites(Number(req.params.userId));
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bookmarks" });
  }
});

// Remove a gym from favorites
router.delete("/", async (req: Request, res: Response) => {
  try {
    const { userId, gymId } = req.body;
    await removeFavorite(Number(userId), Number(gymId));
    res.status(200).json({ success: true, message: "Removed from bookmarks." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing bookmark" });
  }
});
export default router;