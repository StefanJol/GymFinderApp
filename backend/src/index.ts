import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import usersRouter from "./routes/users.routes.js";
import gymsRouter from "./routes/gyms.routes.js";
import favoritesRouter from "./routes/favorites.routes.js";
import reviewsRouter from "./routes/reviews.routes.js";
import connectionsRouter from "./routes/connections.routes.js";
// so i dont have to use a js
import path from "path"; 
import { fileURLToPath } from "url";
//
const __dirname = path.resolve();
//



const frontEndApp = express();
const BackEndapp = express();
const port = Number(process.env.PORT) || 8081;
const frontEndPort = 8000;
// 
//
//
//
BackEndapp.use(cors());
BackEndapp.use(express.json());
BackEndapp.use(express.urlencoded({ extended: false }));

BackEndapp.use("/users", usersRouter);
BackEndapp.use("/gyms", gymsRouter);
BackEndapp.use("/favorites", favoritesRouter);
BackEndapp.use("/reviews", reviewsRouter);
BackEndapp.use("/connections", connectionsRouter);

BackEndapp.get("/test", (_req: Request, res: Response) => {
  res.send("Hello from Express 5 and TypeScript");
});

BackEndapp.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// 
// frontend config
const reactBuildPath = path.join(__dirname, "dist"); 
frontEndApp.use(express.static(reactBuildPath));

// Serves index.html for the frontend routes
frontEndApp.get("/*splat", (req, res) => {
  res.sendFile(path.join(reactBuildPath, "index.html"));
 })
 


BackEndapp.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

frontEndApp.listen(frontEndPort, () => {
  console.log('frontend app is running on port ', frontEndPort)
})