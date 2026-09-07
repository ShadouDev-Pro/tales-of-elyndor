import { DECISIONS } from "./decisions.js";

// Probabilidad de que surja una decisión pendiente por cada 365 días
// avanzados. Deliberadamente más baja que la de acontecimientos pasivos
// (60%), porque una decisión detiene el avance del tiempo hasta
// resolverse — no queremos interrumpir constantemente al jugador.
const DECISION_CHANCE_PER_YEAR = 0.3;

/**
 * Decide si, tras avanzar `days` días, surge una decisión pendiente.
 * Devuelve el id de la decisión elegida, o null si no surge ninguna.
 */
export function rollForDecision(days) {
  const chance = DECISION_CHANCE_PER_YEAR * (days / 365);
  if (Math.random() >= chance) {
    return null;
  }

  const chosen = DECISIONS[Math.floor(Math.random() * DECISIONS.length)];
  return chosen.id;
}