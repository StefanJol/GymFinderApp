import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import usersRouter from "./routes/users.routes.js";
import gymsRouter from "./routes/gyms.routes.js";
import favoritesRouter from "./routes/favorites.routes.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", usersRouter);
app.use("/gyms", gymsRouter);
app.use("/favorites", favoritesRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from Express 5 and TypeScript");
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});