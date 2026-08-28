/**
 * Dimensiones de personalidad del personaje.
 *
 * A diferencia de los atributos, la personalidad podrá permanecer
 * parcialmente oculta al jugador (ver documento de diseño, sección 9.8).
 * Los rasgos, en cambio, sí serán visibles — personalidad y rasgos son
 * sistemas independientes que coexisten.
 *
 * Cada dimensión se representa con un único valor numérico (a diferencia
 * de los atributos, que tienen actual/potencial): la personalidad no se
 * "entrena", es un rasgo de base del personaje.
 */

export const PERSONALITY_DIMENSIONS = [
  {
    id: "valentia",
    name: "Valentía",
    description: "Disposición a afrontar el peligro o el riesgo.",
  },
  {
    id: "sociabilidad",
    name: "Sociabilidad",
    description: "Facilidad para relacionarse e iniciar vínculos.",
  },
  {
    id: "empatia",
    name: "Empatía",
    description: "Sensibilidad hacia los sentimientos ajenos.",
  },
  {
    id: "disciplina",
    name: "Disciplina",
    description: "Constancia y capacidad de autocontrol.",
  },
  {
    id: "impulsividad",
    name: "Impulsividad",
    description: "Tendencia a actuar sin reflexionar.",
  },
  {
    id: "ambicion",
    name: "Ambición",
    description: "Motivación por progresar, destacar o acumular poder o riqueza.",
  },
];

export const PERSONALITY_DIMENSION_IDS = PERSONALITY_DIMENSIONS.map((d) => d.id);

export function getPersonalityDimensionById(id) {
  return PERSONALITY_DIMENSIONS.find((d) => d.id === id);
}