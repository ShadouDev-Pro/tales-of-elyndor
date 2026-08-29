/**
 * Catálogo de rasgos disponibles en el juego.
 *
 * Este es un punto de partida deliberadamente pequeño. El documento de
 * diseño (sección 9.7) describe los rasgos como algo que puede aparecer,
 * fortalecerse, debilitarse, desaparecer, evolucionar o entrar en
 * conflicto con otros — ninguna de esas mecánicas está implementada
 * todavía. Por ahora un rasgo es solo una etiqueta fija que un personaje
 * tiene o no tiene.
 */

export const TRAITS = [
  {
    id: "valiente",
    name: "Valiente",
    type: "positivo",
    description: "Afronta el peligro con más facilidad que la mayoría.",
  },
  {
    id: "cobarde",
    name: "Cobarde",
    type: "negativo",
    description: "Tiende a evitar el riesgo y el conflicto directo.",
  },
  {
    id: "carismatico",
    name: "Carismático",
    type: "positivo",
    description: "Genera simpatía con facilidad en quienes le rodean.",
  },
  {
    id: "arrogante",
    name: "Arrogante",
    type: "negativo",
    description: "Tiende a menospreciar a los demás o sobrevalorarse a sí mismo.",
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
  },
  {
    id: "generoso",
    name: "Generoso",
    type: "positivo",
    description: "Dispuesto a compartir o ayudar sin esperar nada a cambio.",
  },
  {
    id: "solitario",
    name: "Solitario",
    type: "neutral",
    description: "Prefiere su propia compañía a la de otros.",
  },
];

export function getTraitById(id) {
  return TRAITS.find((trait) => trait.id === id);
}