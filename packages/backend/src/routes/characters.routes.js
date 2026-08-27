import { Router } from "express";
import { randomUUID } from "node:crypto";
import { createCharacter, PLAYABLE_RACES } from "@toe/shared";

export const charactersRouter = Router();

// Almacenamiento en memoria: punto de partida temporal.
// Cuando se añada persistencia real, este módulo se sustituirá por
// una capa de base de datos.
const characters = new Map();

// GET /api/characters
charactersRouter.get("/", (req, res) => {
  res.json(Array.from(characters.values()));
});

// GET /api/characters/:id
charactersRouter.get("/:id", (req, res) => {
  const character = characters.get(req.params.id);
  if (!character) {
    return res.status(404).json({ error: `Personaje "${req.params.id}" no encontrado.` });
  }
  res.json(character);
});

// POST /api/characters  { name, raceId, sex, birthRegion }
charactersRouter.post("/", (req, res) => {
  const { name, raceId, sex, birthRegion } = req.body ?? {};

  if (!name || !raceId) {
    return res.status(400).json({ error: "Se requieren al menos 'name' y 'raceId'." });
  }

  const playableIds = PLAYABLE_RACES.map((race) => race.id);
  if (!playableIds.includes(raceId)) {
    return res.status(400).json({
      error: `raceId inválido. Valores permitidos: ${playableIds.join(", ")}`,
    });
  }

  try {
    const character = createCharacter({ name, raceId, sex, birthRegion });
    const id = randomUUID();
    const stored = { id, ...character };
    characters.set(id, stored);
    res.status(201).json(stored);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
