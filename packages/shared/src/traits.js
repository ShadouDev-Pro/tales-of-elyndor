/**
 * Catálogo de rasgos disponibles en el juego.
 *
 * Este es un punto de partida deliberadamente pequeño. El documento de
 * diseño (sección 9.7) describe los rasgos como algo que puede aparecer,
 * fortalecerse, debilitarse, desaparecer, evolucionar o entrar en
 * conflicto con otros — ninguna de esas mecánicas está implementada
 * todavía. Por ahora un rasgo es solo una etiqueta fija que un personaje
 * tiene o no tiene.
 *
 * `personalityAffinity` (opcional) indica qué dimensión de personalidad
 * hace más probable que aparezca este rasgo. `direction: "high"` significa
 * que un valor alto en esa dimensión aumenta la probabilidad; "low"
 * significa que un valor bajo la aumenta. Los rasgos sin afinidad definida
 * se tratan como igual de probables para cualquier personaje.
 */

export const TRAITS = [
  {
    id: "valiente",
    name: "Valiente",
    type: "positivo",
    description: "Afronta el peligro con más facilidad que la mayoría.",
    personalityAffinity: { dimensionId: "valentia", direction: "high" },
    conflictsWith: ["cobarde"],
  },
  {
    id: "cobarde",
    name: "Cobarde",
    type: "negativo",
    description: "Tiende a evitar el riesgo y el conflicto directo.",
    personalityAffinity: { dimensionId: "valentia", direction: "low" },
    conflictsWith: ["valiente"],
  },
  {
    id: "carismatico",
    name: "Carismático",
    type: "positivo",
    description: "Genera simpatía con facilidad en quienes le rodean.",
    personalityAffinity: { dimensionId: "sociabilidad", direction: "high" },
  },
  {
    id: "arrogante",
    name: "Arrogante",
    type: "negativo",
    description: "Tiende a menospreciar a los demás o sobrevalorarse a sí mismo.",
    personalityAffinity: { dimensionId: "empatia", direction: "low" },
  },
  {
    id: "curioso",
    name: "Curioso",
    type: "neutral",
    description: "Siente una fuerte atracción por lo desconocido.",
  },
  {
    id: "desconfiado",
    name: "Desconfiado",
    type: "negativo",
    description: "Le cuesta confiar en las intenciones ajenas.",
    personalityAffinity: { dimensionId: "sociabilidad", direction: "low" },
  },
  {
    id: "generoso",
    name: "Generoso",
    type: "positivo",
    description: "Dispuesto a compartir o ayudar sin esperar nada a cambio.",
    personalityAffinity: { dimensionId: "empatia", direction: "high" },
  },
  {
    id: "solitario",
    name: "Solitario",
    type: "neutral",
    description: "Prefiere su propia compañía a la de otros.",
    personalityAffinity: { dimensionId: "sociabilidad", direction: "low" },
  },
];

export function getTraitById(id) {
  return TRAITS.find((trait) => trait.id === id);
}

/**
 * Aplica el efecto de rasgo de un acontecimiento (ver events.js) sobre un
 * array de ids de rasgos existentes. A diferencia de la aparición normal
 * de rasgos, esto puede saltarse un conflicto a propósito (representa un
 * cambio real vivido por el personaje, no una elección al azar).
 */
export function applyTraitEffect(existingTraitIds, effect) {
  if (!effect) return existingTraitIds;

  let updated = existingTraitIds;

  if (effect.type === "add") {
    if (effect.removesTraitId) {
      updated = updated.filter((id) => id !== effect.removesTraitId);
    }
    if (!updated.includes(effect.traitId)) {
      updated = [...updated, effect.traitId];
    }
  }

  if (effect.type === "remove") {
    updated = updated.filter((id) => id !== effect.traitId);
  }

  return updated;
}