import { TRAITS, getTraitById } from "./traits.js";

// Probabilidad de que aparezca un rasgo nuevo por cada 365 días avanzados.
// Es un valor de partida arbitrario, pensado para poder ajustarse fácilmente.
const TRAIT_CHANCE_PER_YEAR = 0.15;

// Peso mínimo que tiene cualquier rasgo, aunque no encaje con la
// personalidad del personaje. Evita que un rasgo sea directamente
// imposible: alguien con Valentía muy baja podría, aun así, desarrollar
// "Valiente" alguna vez, solo que con mucha menos frecuencia.
const MIN_WEIGHT = 0.1;

function weightForTrait(trait, personality) {
  if (!trait.personalityAffinity) {
    return 0.5; // rasgo sin afinidad conocida: probabilidad neutral fija.
  }

  const { dimensionId, direction } = trait.personalityAffinity;
  const value = personality[dimensionId] ?? 50;
  const normalized = direction === "high" ? value / 100 : (100 - value) / 100;

  return MIN_WEIGHT + normalized;
}

function pickWeighted(traits, personality) {
  const weights = traits.map((trait) => weightForTrait(trait, personality));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  let roll = Math.random() * totalWeight;
  for (let i = 0; i < traits.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return traits[i];
  }
  return traits[traits.length - 1]; // salvaguarda por redondeo de floats.
}

/**
 * Decide si, tras avanzar `days` días, el personaje adquiere un rasgo nuevo.
 * Devuelve el id del rasgo nuevo, o null si no aparece ninguno.
 *
 * `existingTraitIds` evita repetir un rasgo que el personaje ya tiene.
 * `personality` influye en QUÉ rasgo se elige (no en si aparece o no).
 */
export function rollForNewTrait(days, existingTraitIds, personality) {
  const chance = TRAIT_CHANCE_PER_YEAR * (days / 365);
  if (Math.random() >= chance) {
    return null;
  }

  const available = TRAITS.filter((trait) => {
    if (existingTraitIds.includes(trait.id)) return false;

    const conflictsWithExisting = (trait.conflictsWith ?? []).some((id) =>
      existingTraitIds.includes(id)
    );
    const existingConflictsWithThis = existingTraitIds.some((id) =>
      (getTraitById(id)?.conflictsWith ?? []).includes(trait.id)
    );

    return !conflictsWithExisting && !existingConflictsWithThis;
  });
  
  if (available.length === 0) {
    return null;
  }

  const chosen = pickWeighted(available, personality);
  return chosen.id;
}