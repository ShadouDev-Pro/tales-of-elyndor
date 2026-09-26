import { DECISIONS } from "./decisions.js";

const DECISION_CHANCE_PER_YEAR = 0.3;
const FAVORED_WEIGHT = 3;
const BASE_WEIGHT = 1;

function matchesConditions(character, conditions) {
  if (!conditions) return true;
  if (conditions.raceId && character.raceId !== conditions.raceId) return false;
  if (conditions.education && character.education !== conditions.education) return false;
  if (conditions.religion && character.religion !== conditions.religion) return false;
  return true;
}

function pickWeighted(decisions, character) {
  const weights = decisions.map((decision) =>
    matchesConditions(character, decision.favors) ? FAVORED_WEIGHT : BASE_WEIGHT
  );
  const total = weights.reduce((sum, w) => sum + w, 0);

  let roll = Math.random() * total;
  for (let i = 0; i < decisions.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return decisions[i];
  }
  return decisions[decisions.length - 1];
}

/**
 * Decide si, tras avanzar `days` días, surge una decisión pendiente.
 *
 * `character` necesita `{ raceId, education, religion }` para poder
 * evaluar los requisitos (`requires`, obligatorio) y preferencias
 * (`favors`, solo aumenta probabilidad) de cada decisión.
 */
export function rollForDecision(days, character) {
  const chance = DECISION_CHANCE_PER_YEAR * (days / 365);
  if (Math.random() >= chance) {
    return null;
  }

  const eligible = DECISIONS.filter((decision) => matchesConditions(character, decision.requires));
  if (eligible.length === 0) return null;

  const chosen = pickWeighted(eligible, character);
  return chosen.id;
}