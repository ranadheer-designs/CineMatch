import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleAnalyzeShot } from "./routes/analyze";
import { handleGenerateGuide } from "./routes/guide";
import { handleTMDBShots } from "./routes/tmdb-shots";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // CINEMATCH AI routes
  app.post("/api/analyze-shot", handleAnalyzeShot);
  app.post("/api/generate-guide", handleGenerateGuide);
  app.get("/api/tmdb-shots", handleTMDBShots);

  return app;
}
