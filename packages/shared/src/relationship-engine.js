import { getRelationshipEventsForStatus } from "./relationship-events.js";
import { generateName, oppositeSex } from "./names.js";

// Probabilidad de que ocurra un evento de relación por cada año,
// independiente de la probabilidad de acontecimientos normales.
const RELATIONSHIP_EVENT_CHANCE_PER_YEAR = 0.25;

/**
 * Decide si, tras avanzar `days` días, ocurre un evento de relación.
 * `character` necesita `{ name, sex, relationshipStatus }`.
 *
 * Devuelve null, o un resultado con el texto ya resuelto y los datos
 * necesarios para actualizar el estado (nuevo status, y si corresponde,
 * el nombre de la pareja o del hijo nuevo).
 */
export function rollForRelationshipEvent(days, character, currentPartnerName) {
  const chance = RELATIONSHIP_EVENT_CHANCE_PER_YEAR * (days / 365);
  if (Math.random() >= chance) return null;

  const available = getRelationshipEventsForStatus(character.relationshipStatus);
  if (available.length === 0) return null;

  const chosen = available[Math.floor(Math.random() * available.length)];

  let partnerName = currentPartnerName;
  let childName = null;

  if (chosen.id === "conocio_pareja") {
    partnerName = generateName(oppositeSex(character.sex));
  }
  
  let childSex = null;
  if (chosen.createsChild) {
    childSex = Math.random() < 0.5 ? "masculino" : "femenino";
    childName = generateName(childSex);
  }

  const text = chosen.text
    .replaceAll("{name}", character.name)
    .replaceAll("{partnerName}", partnerName ?? "")
    .replaceAll("{childName}", childName ?? "");

  return {
    eventId: chosen.id,
    text,
    resultStatus: chosen.resultStatus,
    partnerName,
    newChildName: chosen.createsChild ? childName : null,
    newChildSex: chosen.createsChild ? childSex : null,
  };
}