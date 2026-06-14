import { Router, Request, Response } from "express";
import { addReview, getGymReviews } from "../db/database.js";

const router = Router();

// Post a new review
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, gymId, rating, comment } = req.body;
    
    if (!rating || !comment || !comment.trim()) {
      res.status(400).json({ success: false, message: "Rating and comment are required." });
      return;
    }

    await addReview(Number(userId), Number(gymId), Number(rating), comment.trim());
    res.status(201).json({ success: true, message: "Review added successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving review" });
  }
});

// Get all reviews for a specific gym
router.get("/gym/:gymId", async (req: Request, res: Response) => {
  try {
    const reviews = await getGymReviews(Number(req.params.gymId));
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
});

export default router;