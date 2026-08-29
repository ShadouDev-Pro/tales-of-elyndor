import { TRAITS } from "./traits.js";

// Probabilidad de que aparezca un rasgo nuevo por cada 365 días avanzados.
// Es un valor de partida arbitrario, pensado para poder ajustarse fácilmente
// cuando la probabilidad dependa de la personalidad (pendiente para más adelante).
const TRAIT_CHANCE_PER_YEAR = 0.15;

/**
 * Decide si, tras avanzar `days` días, el personaje adquiere un rasgo nuevo.
 * Devuelve el id del rasgo nuevo, o null si no aparece ninguno.
 *
 * `existingTraitIds` evita repetir un rasgo que el personaje ya tiene.
 */
export function rollForNewTrait(days, existingTraitIds) {
  const chance = TRAIT_CHANCE_PER_YEAR * (days / 365);
  if (Math.random() >= chance) {
    return null;
  }

  const available = TRAITS.filter((trait) => !existingTraitIds.includes(trait.id));
  if (available.length === 0) {
    return null;
  }

  const chosen = available[Math.floor(Math.random() * available.length)];
  return chosen.id;
}