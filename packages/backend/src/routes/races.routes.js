import { Router } from "express";
import { RACES, PLAYABLE_RACES, getRaceById } from "@toe/shared";

export const racesRouter = Router();

// GET /api/races?playable=true
racesRouter.get("/", (req, res) => {
  const onlyPlayable = req.query.playable === "true";
  res.json(onlyPlayable ? PLAYABLE_RACES : RACES);
});

// GET /api/races/:id
racesRouter.get("/:id", (req, res) => {
  const race = getRaceById(req.params.id);
  if (!race) {
    return res.status(404).json({ error: `Raza "${req.params.id}" no encontrada.` });
  }
  res.json(race);
});
