import { CHILDHOOD_EVENTS } from "./childhood-events.js";
import { applyTraitEffect } from "./traits.js";

// Probabilidad de que ocurra un acontecimiento de infancia por cada año.
const CHILDHOOD_EVENT_CHANCE_PER_YEAR = 0.5;

function rollForChildhoodEvent(characterName) {
  if (Math.random() >= CHILDHOOD_EVENT_CHANCE_PER_YEAR) return null;

  const chosen = CHILDHOOD_EVENTS[Math.floor(Math.random() * CHILDHOOD_EVENTS.length)];
  return {
    text: chosen.text.replaceAll("{name}", characterName),
    traitEffect: chosen.traitEffect ?? null,
    skillEffect: chosen.skillEffect ?? null,
  };
}

/**
 * Simula la infancia completa de un personaje, año a año, desde el
 * nacimiento hasta la edad de madurez de su raza (documento de diseño,
 * sección 2.4). Devuelve el historial de infancia, los rasgos
 * adquiridos y las habilidades tempranas — los atributos y la
 * personalidad siguen generándose como hasta ahora, sin tocarlos aquí.
 */
export function simulateChildhood(characterName, maturityAgeYears) {
  const history = [];
  let traitIds = [];
  const skills = {};

  for (let year = 1; year <= maturityAgeYears; year++) {
    const event = rollForChildhoodEvent(characterName);
    if (!event) continue;

    history.push({ ageDays: year * 365, text: event.text });

    if (event.traitEffect) {
      traitIds = applyTraitEffect(traitIds, event.traitEffect);
    }
    if (event.skillEffect) {
      const current = skills[event.skillEffect.skillId] ?? 0;
      skills[event.skillEffect.skillId] = current + event.skillEffect.amount;
    }
  }

  return { history, traitIds, skills };
}