import { Request, Response, NextFunction, Router } from "express";
import crypto from "crypto";
import { authUser, createUser } from "../db/database.js";

const router = Router();

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();

    if (!username || !password) {
      res.status(400).json({ success: false, message: "Username and password are required." });
      return;
    }

    const queryResult = await authUser(username);

    if (queryResult.length === 0) {
      res.status(401).json({ success: false, message: "User is not registered." });
      return;
    }

    const user = queryResult[0];
    const [salt, originalHash] = user.password_hash.split(":");

    crypto.pbkdf2(password, salt, 1000, 64, "sha512", (err, derivedKey) => {
      if (err) return next(err);

      if (derivedKey.toString("hex") !== originalHash) {
        res.status(401).json({ success: false, message: "Incorrect password." });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Login successful.",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    if (!username || !email || !password) {
      res.status(400).json({ success: false, message: "Username, email and password are required." });
      return;
    }

    const salt = crypto.randomBytes(16).toString("hex");
    
    crypto.pbkdf2(password, salt, 1000, 64, "sha512", async (err, derivedKey) => {
      if (err) return next(err);

      const passwordHash = salt + ":" + derivedKey.toString("hex");
      const queryResult = await createUser(username, email, passwordHash);

      if (queryResult.affectedRows === 1) {
        res.status(201).json({ success: true, message: "User registered." });
        return;
      }

      res.status(500).json({ success: false, message: "User was not registered." });
    });
  } catch (error) {
    next(error);
  }
};

router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;