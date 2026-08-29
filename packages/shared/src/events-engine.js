import { EVENTS } from "./events.js";

// Probabilidad de que ocurra un acontecimiento por cada 365 días avanzados.
// Es más alta que la de los rasgos (15%) porque un acontecimiento no deja
// una marca permanente en el personaje, así que puede repetirse sin problema.
const EVENT_CHANCE_PER_YEAR = 0.6;

/**
 * Decide si, tras avanzar `days` días, ocurre un acontecimiento.
 * Devuelve el evento elegido (objeto con id y texto ya resuelto para
 * `characterName`), o null si no ocurre nada esta vez.
 */
export function rollForEvent(days, characterName) {
  const chance = EVENT_CHANCE_PER_YEAR * (days / 365);
  if (Math.random() >= chance) {
    return null;
  }

  const chosen = EVENTS[Math.floor(Math.random() * EVENTS.length)];
  return {
    id: chosen.id,
    text: chosen.text.replace("{name}", characterName),
  };
}