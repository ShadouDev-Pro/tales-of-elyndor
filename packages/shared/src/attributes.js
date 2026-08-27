/**
 * Atributos fundamentales del personaje.
 *
 * Cada atributo representa una capacidad general del personaje y NO
 * determina por sí solo su profesión o identidad (ver documento de diseño,
 * sección 9.1).
 *
 * En el modelo de personaje, cada atributo se compone de dos valores:
 *   - actual: nivel que el personaje posee actualmente.
 *   - potencial: hasta dónde podría desarrollarse naturalmente.
 *
 * (ver createCharacter en character.js)
 */

export const ATTRIBUTES = [
  {
    id: "fuerza",
    name: "Fuerza",
    description: "Potencia física y capacidad para realizar esfuerzos físicos.",
  },
  {
    id: "agilidad",
    name: "Agilidad",
    description: "Velocidad, coordinación, equilibrio y reflejos.",
  },
  {
    id: "resistencia",
    name: "Resistencia",
    description: "Aguante físico y capacidad para soportar esfuerzos y daños.",
  },
  {
    id: "intelecto",
    name: "Intelecto",
    description: "Razonamiento, memoria y capacidad de aprendizaje.",
  },
  {
    id: "percepcion",
    name: "Percepción",
    description: "Capacidad para percibir, observar e interpretar el entorno.",
  },
  {
    id: "voluntad",
    name: "Voluntad",
    description: "Determinación, disciplina y resistencia mental.",
  },
];

export const ATTRIBUTE_IDS = ATTRIBUTES.map((attribute) => attribute.id);

export function getAttributeById(id) {
  return ATTRIBUTES.find((attribute) => attribute.id === id);
}
