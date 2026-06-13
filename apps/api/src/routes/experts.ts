import { Router } from "express";
import { experts, getExpert } from "../data/experts.js";

export const expertsRouter = Router();

expertsRouter.get("/", (_req, res) => {
  res.json({ experts: experts.filter((expert) => expert.isActive) });
});

expertsRouter.get("/:id", (req, res) => {
  const expert = getExpert(req.params.id);
  if (!expert || !expert.isActive) return res.status(404).json({ error: "Expert not found" });
  res.json({ expert });
});
