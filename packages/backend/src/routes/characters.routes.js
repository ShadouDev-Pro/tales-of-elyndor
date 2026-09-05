import { Router } from "express";

import {
  createCharacter,
  PLAYABLE_RACES,
  rollForNewTrait,
  rollForEvent,
  applyTraitEffect,
  growAttributes,
  applyAttributeEffect,
  pruneExpiredModifiers,
  rollCheck,
  getEffectiveAttributeValue,
} from "@toe/shared";

import { pool } from "../db.js";

export const charactersRouter = Router();

function rowToCharacter(row) {
  return {
    id: row.id,
    name: row.nombre,
    raceId: row.raza_id,
    sex: row.sexo,
    birthRegion: row.region_nacimiento,
    ageDays: row.edad_dias,
    attributes: row.atributos,
    temporaryModifiers: row.modificadores_temporales,
    personality: row.personalidad,
    traits: row.rasgos,
    skills: row.habilidades,
    history: row.historial,
    createdAt: row.creado_en,
  };
}

// GET /api/characters
charactersRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM personajes ORDER BY creado_en DESC"
    );
    res.json(result.rows.map(rowToCharacter));
  } catch (error) {
    res.status(500).json({ error: "Error al leer los personajes." });
  }
});

// GET /api/characters/:id
charactersRouter.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM personajes WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Personaje "${req.params.id}" no encontrado.` });
    }
    res.json(rowToCharacter(result.rows[0]));
  } catch (error) {
    res.status(500).json({ error: "Error al leer el personaje." });
  }
});

// POST /api/characters  { name, raceId, sex, birthRegion }
charactersRouter.post("/", async (req, res) => {
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

    const result = await pool.query(
      `INSERT INTO personajes (nombre, raza_id, sexo, region_nacimiento, edad_dias, atributos, personalidad, rasgos, habilidades)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        character.name,
        character.raceId,
        character.sex ?? null,
        character.birthRegion,
        character.ageDays,
        JSON.stringify(character.attributes),
        JSON.stringify(character.personality),
        JSON.stringify(character.traits),
        JSON.stringify(character.skills),
      ]
    );

    res.status(201).json(rowToCharacter(result.rows[0]));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/characters/:id
charactersRouter.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM personajes WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Personaje "${req.params.id}" no encontrado.` });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el personaje." });
  }
});

/// POST /api/characters/:id/advance-time  { days }
charactersRouter.post("/:id/advance-time", async (req, res) => {
  const { days } = req.body ?? {};

  if (!Number.isInteger(days) || days <= 0) {
    return res.status(400).json({ error: "'days' debe ser un entero positivo." });
  }

  try {
    const current = await pool.query(
      "SELECT nombre, edad_dias, rasgos, historial, personalidad, atributos, raza_id, modificadores_temporales FROM personajes WHERE id = $1",
      [req.params.id]
    );
    if (current.rows.length === 0) {
      return res.status(404).json({ error: `Personaje "${req.params.id}" no encontrado.` });
    }

    const {
      nombre,
      edad_dias: currentAgeDays,
      rasgos: existingTraitIds,
      historial: existingHistory,
      personalidad: personality,
      atributos: currentAttributes,
      raza_id: raceId,
      modificadores_temporales: existingModifiers,
    } = current.rows[0];

    const newAgeDays = currentAgeDays + days;

    // 1. Probabilidad normal de rasgo nuevo, ponderada por personalidad.
    const newTraitId = rollForNewTrait(days, existingTraitIds, personality);
    let updatedTraitIds = newTraitId ? [...existingTraitIds, newTraitId] : existingTraitIds;

    // 2. Acontecimiento, que puede traer efecto sobre rasgos y/o atributos.
    const event = rollForEvent(days, nombre);
    if (event?.traitEffect) {
      updatedTraitIds = applyTraitEffect(updatedTraitIds, event.traitEffect);
    }

    const updatedHistory = event
      ? [...existingHistory, { ageDays: newAgeDays, text: event.text }]
      : existingHistory;

    // 3. Crecimiento pasivo de atributos.
    let updatedAttributes = growAttributes(days, currentAttributes, raceId);

    // 4. Limpiar modificadores temporales caducados, y aplicar el efecto
    //    del acontecimiento sobre atributos (permanente o temporal).
    let updatedModifiers = pruneExpiredModifiers(existingModifiers, newAgeDays);
    if (event?.attributeEffect) {
      const result = applyAttributeEffect(
        updatedAttributes,
        updatedModifiers,
        event.attributeEffect,
        newAgeDays
      );
      updatedAttributes = result.attributes;
      updatedModifiers = result.temporaryModifiers;
    }

    const result = await pool.query(
      `UPDATE personajes
       SET edad_dias = $1, rasgos = $2, historial = $3, atributos = $4, modificadores_temporales = $5
       WHERE id = $6
       RETURNING *`,
      [
        newAgeDays,
        JSON.stringify(updatedTraitIds),
        JSON.stringify(updatedHistory),
        JSON.stringify(updatedAttributes),
        JSON.stringify(updatedModifiers),
        req.params.id,
      ]
    );

    res.json({
      ...rowToCharacter(result.rows[0]),
      newTrait: newTraitId,
      newEvent: event?.text ?? null,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al avanzar el tiempo del personaje." });
  }
});

// POST /api/characters/:id/check  { attributeId, difficulty, extraModifiers? }
charactersRouter.post("/:id/check", async (req, res) => {
  const { attributeId, difficulty, extraModifiers } = req.body ?? {};

  if (!attributeId || !Number.isInteger(difficulty)) {
    return res.status(400).json({ error: "Se requieren 'attributeId' y 'difficulty' (entero)." });
  }

  try {
    const current = await pool.query(
      "SELECT atributos, modificadores_temporales FROM personajes WHERE id = $1",
      [req.params.id]
    );
    if (current.rows.length === 0) {
      return res.status(404).json({ error: `Personaje "${req.params.id}" no encontrado.` });
    }

    const { atributos: attributes, modificadores_temporales: temporaryModifiers } = current.rows[0];
    const attribute = attributes[attributeId];
    if (!attribute) {
      return res.status(400).json({ error: `Atributo "${attributeId}" no válido.` });
    }

    const effectiveValue = getEffectiveAttributeValue(attributeId, attribute.actual, temporaryModifiers);

    const result = rollCheck({
      attributeValue: effectiveValue,
      difficulty,
      extraModifiers: Number.isInteger(extraModifiers) ? extraModifiers : 0,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al resolver la tirada." });
  }
});