/**
 * Sistema de tiradas (documento de diseño, sección 9.11-9.12).
 *
 * Estructura general: D20 + atributos + habilidades + modificadores
 * circunstanciales, contra una dificultad. El sistema de habilidades
 * todavía no existe, así que por ahora solo se combinan atributos y
 * modificadores explícitos.
 *
 * Importante (sección 9.12): un resultado extraordinario (crítico) se
 * SEÑALA aquí, pero su efecto narrativo concreto lo decide quien use
 * esta tirada — este motor nunca inventa consecuencias por sí mismo.
 */

const DIE_SIDES = 20;

/**
 * Convierte un valor de atributo (escala 0-100) en un modificador para
 * el D20. Un atributo de 10 da +1; uno de 100 (techo) da +10.
 */
export function attributeToModifier(attributeValue) {
  return Math.floor(attributeValue / 10);
}

/**
 * Resuelve una tirada. `attributeValue` ya debe ser el valor EFECTIVO
 * del atributo (incluyendo modificadores temporales, ver
 * getEffectiveAttributeValue en attributes-engine.js) — este motor no
 * sabe nada de personajes, solo de números.
 *
 * `extraModifiers` es la suma de cualquier otro modificador circunstancial
 * (rasgos, equipamiento, entorno...) que el llamador ya haya calculado.
 */
export function rollCheck({ attributeValue, difficulty, extraModifiers = 0 }) {
  const die = Math.floor(Math.random() * DIE_SIDES) + 1;
  const attributeModifier = attributeToModifier(attributeValue);
  const total = die + attributeModifier + extraModifiers;

  let critical = null;
  if (die === DIE_SIDES) critical = "success";
  if (die === 1) critical = "failure";

  return {
    die,
    attributeModifier,
    extraModifiers,
    total,
    difficulty,
    success: total >= difficulty,
    critical,
  };
}