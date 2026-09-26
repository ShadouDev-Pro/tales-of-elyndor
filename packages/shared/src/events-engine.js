import { EVENTS } from "./events.js";

// Probabilidad de que ocurra un acontecimiento por cada 365 días avanzados.
const EVENT_CHANCE_PER_YEAR = 0.6;

/**
 * Decide si, tras avanzar `days` días, ocurre un acontecimiento.
 * Devuelve el evento elegido (id, texto ya resuelto para `characterName`,
 * y su traitEffect/attributeEffect si los tiene), o null si no ocurre
 * nada esta vez.
 */
export function rollForEvent(days, characterName) {
  const chance = EVENT_CHANCE_PER_YEAR * (days / 365);
  if (Math.random() >= chance) {
    return null;
  }

  const chosen = EVENTS[Math.floor(Math.random() * EVENTS.length)];
  return {
    id: chosen.id,
    text: chosen.text.replaceAll("{name}", characterName),
    traitEffect: chosen.traitEffect ?? null,
    attributeEffect: chosen.attributeEffect ?? null,
  };
}