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
  practiceSkill,
  isValidLeafSkill,
  checkDeathByOldAge,
  DEATH_CAUSE_OLD_AGE,
  getRaceById,
  rollForDecision,
  getDecisionById,
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
    gameMode: row.modo_partida,
    alive: row.vivo,
    causeOfDeath: row.causa_muerte,
    pendingDecision: row.decision_pendiente
      ? getDecisionById(row.decision_pendiente)
      : null,
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
  const { name, raceId, sex, birthRegion, gameMode } = req.body ?? {};

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
    const character = createCharacter({ name, raceId, sex, birthRegion, gameMode });

    const result = await pool.query(
      `INSERT INTO personajes (nombre, raza_id, sexo, region_nacimiento, edad_dias, atributos, personalidad, rasgos, habilidades, modo_partida)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
        character.gameMode,
      ],
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

// POST /api/characters/:id/advance-time  { days }
charactersRouter.post("/:id/advance-time", async (req, res) => {
  const { days } = req.body ?? {};

  if (!Number.isInteger(days) || days <= 0) {
    return res.status(400).json({ error: "'days' debe ser un entero positivo." });
  }

  try {
    const current = await pool.query(
      "SELECT nombre, edad_dias, rasgos, historial, personalidad, atributos, raza_id, modificadores_temporales, vivo, decision_pendiente FROM personajes WHERE id = $1",
      [req.params.id]
    );
    if (current.rows.length === 0) {
      return res.status(404).json({ error: `Personaje "${req.params.id}" no encontrado.` });
    }

    if (!current.rows[0].vivo) {
      return res.status(400).json({ error: "Este personaje ya ha fallecido." });
    }

    if (current.rows[0].decision_pendiente) {
      return res
        .status(400)
        .json({
          error: "Hay una decisión pendiente que resolver antes de continuar.",
        });
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

    const race = getRaceById(raceId);
    const lifeExpectancy = race?.biology?.lifespan?.lifeExpectancy ?? 70;

    const deathCheck = checkDeathByOldAge(currentAgeDays, days, lifeExpectancy);

    if (deathCheck.died) {
      const updatedHistory = [
        ...existingHistory,
        { ageDays: deathCheck.ageDaysAtDeath, text: `${nombre} falleció. ${DEATH_CAUSE_OLD_AGE}` },
      ];

      const result = await pool.query(
        `UPDATE personajes
         SET edad_dias = $1, historial = $2, vivo = false, causa_muerte = $3
         WHERE id = $4
         RETURNING *`,
        [deathCheck.ageDaysAtDeath, JSON.stringify(updatedHistory), DEATH_CAUSE_OLD_AGE, req.params.id]
      );

      return res.json({
        ...rowToCharacter(result.rows[0]),
        newTrait: null,
        newEvent: `${nombre} falleció. ${DEATH_CAUSE_OLD_AGE}`,
      });
    }

    const newAgeDays = currentAgeDays + days;

    const newTraitId = rollForNewTrait(days, existingTraitIds, personality);
    let updatedTraitIds = newTraitId ? [...existingTraitIds, newTraitId] : existingTraitIds;

    const event = rollForEvent(days, nombre);
    if (event?.traitEffect) {
      updatedTraitIds = applyTraitEffect(updatedTraitIds, event.traitEffect);
    }

    const updatedHistory = event
      ? [...existingHistory, { ageDays: newAgeDays, text: event.text }]
      : existingHistory;

    let updatedAttributes = growAttributes(days, currentAttributes, raceId);

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

    const newDecisionId = rollForDecision(days);

    const result = await pool.query(
      `UPDATE personajes
       SET edad_dias = $1, rasgos = $2, historial = $3, atributos = $4, modificadores_temporales = $5, decision_pendiente = $6
       WHERE id = $7
       RETURNING *`,
      [
        newAgeDays,
        JSON.stringify(updatedTraitIds),
        JSON.stringify(updatedHistory),
        JSON.stringify(updatedAttributes),
        JSON.stringify(updatedModifiers),
        newDecisionId,
        req.params.id,
      ],
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

// POST /api/characters/:id/practice-skill  { skillId }
charactersRouter.post("/:id/practice-skill", async (req, res) => {
  const { skillId } = req.body ?? {};

  if (!skillId || !isValidLeafSkill(skillId)) {
    return res.status(400).json({ error: `skillId inválido: "${skillId}".` });
  }

  try {
    const current = await pool.query(
      "SELECT habilidades FROM personajes WHERE id = $1",
      [req.params.id]
    );
    if (current.rows.length === 0) {
      return res.status(404).json({ error: `Personaje "${req.params.id}" no encontrado.` });
    }

    const skills = current.rows[0].habilidades ?? {};
    const currentValue = skills[skillId] ?? 0;
    const newValue = practiceSkill(currentValue);
    const updatedSkills = { ...skills, [skillId]: newValue };

    const result = await pool.query(
      "UPDATE personajes SET habilidades = $1 WHERE id = $2 RETURNING habilidades",
      [JSON.stringify(updatedSkills), req.params.id]
    );

    res.json({
      skillId,
      previousValue: currentValue,
      newValue: result.rows[0].habilidades[skillId],
      improved: newValue > currentValue,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al practicar la habilidad." });
  }
});

// POST /api/characters/:id/resolve-decision  { optionId }
charactersRouter.post("/:id/resolve-decision", async (req, res) => {
  const { optionId } = req.body ?? {};

  if (!optionId) {
    return res.status(400).json({ error: "Se requiere 'optionId'." });
  }

  try {
    const current = await pool.query(
      "SELECT nombre, edad_dias, historial, atributos, modificadores_temporales, decision_pendiente FROM personajes WHERE id = $1",
      [req.params.id]
    );
    if (current.rows.length === 0) {
      return res.status(404).json({ error: `Personaje "${req.params.id}" no encontrado.` });
    }

    const {
      nombre,
      edad_dias: ageDays,
      historial: existingHistory,
      atributos: attributes,
      modificadores_temporales: temporaryModifiers,
      decision_pendiente: decisionId,
    } = current.rows[0];

    if (!decisionId) {
      return res.status(400).json({ error: "Este personaje no tiene ninguna decisión pendiente." });
    }

    const decision = getDecisionById(decisionId);
    const option = decision.options.find((o) => o.id === optionId);
    if (!option) {
      return res.status(400).json({ error: `Opción "${optionId}" no válida para esta decisión.` });
    }

    const attribute = attributes[option.attributeId];
    const effectiveValue = getEffectiveAttributeValue(option.attributeId, attribute.actual, temporaryModifiers);

    const rollResult = rollCheck({ attributeValue: effectiveValue, difficulty: option.difficulty });

    const outcomeText = (rollResult.success ? option.successText : option.failureText).replace(
      "{name}",
      nombre
    );

    const updatedHistory = [...existingHistory, { ageDays, text: outcomeText }];

    const result = await pool.query(
      `UPDATE personajes
       SET historial = $1, decision_pendiente = NULL
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(updatedHistory), req.params.id]
    );

    res.json({
      ...rowToCharacter(result.rows[0]),
      rollResult,
      outcomeText,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al resolver la decisión." });
  }
});