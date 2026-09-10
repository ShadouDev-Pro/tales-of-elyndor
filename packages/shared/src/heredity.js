import { ATTRIBUTE_IDS } from "./attributes.js";
import { generateAttributes } from "./character.js";

const INHERITANCE_WEIGHT = 0.5;

/**
 * Genera los atributos de un heredero, mezclando un potencial nuevo
 * aleatorio con el potencial del padre/madre (documento de diseño,
 * sección 9.14: la herencia influye, pero nunca copia automáticamente).
 */
export function generateInheritedAttributes(raceId, parentAttributes) {
  const freshAttributes = generateAttributes(raceId);

  return ATTRIBUTE_IDS.reduce((result, id) => {
    const fresh = freshAttributes[id];
    const parentPotencial = parentAttributes[id]?.potencial ?? fresh.potencial;
    const blendedPotencial = Math.round(
      fresh.potencial * (1 - INHERITANCE_WEIGHT) + parentPotencial * INHERITANCE_WEIGHT
    );

    result[id] = { actual: fresh.actual, potencial: blendedPotencial };
    return result;
  }, {});
}