import { getRelationshipEventsForStatus } from "./relationship-events.js";
import { generateName, oppositeSex } from "./names.js";

// Probabilidad de que ocurra un evento de relación "de cortejo"
// (conocer pareja, formalizar, terminar) por cada año. Ya NO incluye
// tener hijos, que ahora tiene su propia probabilidad por raza.
const COURTSHIP_EVENT_CHANCE_PER_YEAR = 0.3;

function rollForCourtshipEvent(days, character) {
  // Los eventos de cortejo excluyen "nace_hijo" — ese se gestiona aparte.
  const available = getRelationshipEventsForStatus(
    character.relationshipStatus,
  ).filter((event) => !event.createsChild);
  if (available.length === 0) return null;

  const urgency = character.wantsGuaranteedHeir ? 3 : 1;
  const chance = COURTSHIP_EVENT_CHANCE_PER_YEAR * urgency * (days / 365);
  if (Math.random() >= chance) return null;

  const chosen = available[Math.floor(Math.random() * available.length)];

  let partnerName = null;
  if (chosen.id === "conocio_pareja") {
    partnerName = generateName(oppositeSex(character.sex));
  }

  return { chosen, partnerName };
}

/**
 * Decide si, tras avanzar `days` días, el personaje tiene un hijo.
 * Solo es posible si está en pareja, dentro de la ventana de fertilidad
 * de su raza (años desde la madurez), y por debajo del máximo de hijos
 * de esa raza.
 */
function rollForChild(days, character, fertility, currentChildrenCount) {
  if (character.relationshipStatus !== "pareja") return false;
  if (currentChildrenCount >= fertility.maxChildren) return false;
  if (character.yearsSinceMaturity > fertility.fertileWindowYears) return false;

  const urgency = character.wantsGuaranteedHeir ? 5 : 1;
  const chance = fertility.chancePerYear * urgency * (days / 365);
  return Math.random() < chance;
}

/**
 * Resuelve los eventos de relación de un avance de tiempo: como mucho
 * un evento de cortejo Y, de forma independiente, la posibilidad de un
 * nuevo hijo (pueden darse ambos a la vez en el mismo avance).
 *
 * `character` necesita `{ name, sex, relationshipStatus, yearsSinceMaturity }`.
 * `fertility` es el objeto de la raza (ver races.js).
 */
export function rollForRelationshipEvent(days, character, currentPartnerName, fertility, currentChildrenCount) {
  const courtship = rollForCourtshipEvent(days, character);
  const childHappens = rollForChild(days, character, fertility, currentChildrenCount);

  if (!courtship && !childHappens) return null;

  const partnerName = courtship?.partnerName ?? currentPartnerName;
  let childName = null;
  let childSex = null;

  if (childHappens) {
    childSex = Math.random() < 0.5 ? "masculino" : "femenino";
    childName = generateName(childSex);
  }

  const texts = [];
  if (courtship) {
    texts.push(
      courtship.chosen.text.replaceAll("{name}", character.name).replaceAll("{partnerName}", partnerName ?? "")
    );
  }
  if (childHappens) {
    texts.push(`${character.name} y ${partnerName} tuvieron un hijo: ${childName}.`);
  }

  return {
    text: texts.join(" "),
    resultStatus: courtship?.chosen.resultStatus ?? character.relationshipStatus,
    partnerName,
    newChildName: childName,
    newChildSex: childSex,
  };
}