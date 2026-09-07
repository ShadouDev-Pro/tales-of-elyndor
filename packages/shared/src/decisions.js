/**
 * Catálogo de decisiones narrativas.
 *
 * A diferencia de los acontecimientos (events.js), una decisión no se
 * resuelve sola: presenta 2+ opciones al jugador, cada una ligada a un
 * atributo y una dificultad, resueltas con el motor de tiradas
 * (rolls.js) al elegir.
 *
 * Punto de partida deliberadamente pequeño y narrativo: por ahora el
 * resultado es solo texto (sin efectos sobre rasgos/atributos), para
 * ver cómo se siente jugarlo antes de añadir mecánica extra.
 *
 * `text` y los textos de resultado pueden usar {name}.
 */

export const DECISIONS = [
  {
    id: "encrucijada_bosque",
    prompt: "El camino se bifurca ante {name}: un sendero angosto entre los árboles, o un desvío más largo pero despejado.",
    options: [
      {
        id: "atajo",
        label: "Tomar el atajo por el bosque",
        attributeId: "agilidad",
        difficulty: 12,
        successText: "{name} avanzó con destreza entre la maleza y ganó tiempo valioso.",
        failureText: "{name} tropezó varias veces entre las raíces y llegó agotado.",
      },
      {
        id: "rodeo",
        label: "Tomar el camino largo",
        attributeId: "resistencia",
        difficulty: 10,
        successText: "{name} aguantó el largo trayecto sin mayor problema.",
        failureText: "{name} llegó exhausto tras la caminata, con los pies destrozados.",
      },
    ],
  },
  {
    id: "disputa_mercado",
    prompt: "Un comerciante acusa a {name}, quizás sin razón, de haber intentado robarle.",
    options: [
      {
        id: "convencer",
        label: "Intentar convencerlo con palabras",
        attributeId: "percepcion",
        difficulty: 13,
        successText: "{name} logró calmar al comerciante y aclarar el malentendido.",
        failureText: "{name} no logró convencerlo, y la escena atrajo miradas incómodas.",
      },
      {
        id: "plantar_cara",
        label: "Plantarle cara con firmeza",
        attributeId: "voluntad",
        difficulty: 14,
        successText: "{name} se mantuvo firme y el comerciante acabó retrocediendo.",
        failureText: "{name} perdió los nervios, y la disputa escaló más de la cuenta.",
      },
    ],
  },
];

export function getDecisionById(id) {
  return DECISIONS.find((decision) => decision.id === id);
}