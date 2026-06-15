import { Router, Request, Response } from "express";
import { getAllMembers, sendConnectionRequest, getPendingRequests, acceptConnectionRequest, removeWorkoutPartner } from "../db/database.js";

const router = Router();

// Get all profiles to browse
router.get("/members/:userId", async (req: Request, res: Response) => {
  try {
    const members = await getAllMembers(Number(req.params.userId));
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching members" });
  }
});

// Send a partner invitation
router.post("/request", async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;
    await sendConnectionRequest(Number(senderId), Number(receiverId));
    res.status(201).json({ success: true, message: "Request sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending request" });
  }
});

// Get received pending requests for notification panel
router.get("/pending/:userId", async (req: Request, res: Response) => {
  try {
    const requests = await getPendingRequests(Number(req.params.userId));
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error loading pending requests" });
  }
});

// Accept a partner request
router.put("/accept", async (req: Request, res: Response) => {
  try {
    const { connectionId } = req.body;
    await acceptConnectionRequest(Number(connectionId));
    res.status(200).json({ success: true, message: "Connection accepted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error accepting connection" });
  }
});

// Remove/Disconnect a workout partner
router.delete("/remove", async (req: Request, res: Response) => {
    try {
      const { userId, partnerId } = req.body;
      await removeWorkoutPartner(Number(userId), Number(partnerId));
      res.status(200).json({ success: true, message: "Partner removed successfully." });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error removing partner" });
    }
  });
  
export default router;