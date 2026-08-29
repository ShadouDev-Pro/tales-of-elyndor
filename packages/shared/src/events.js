/**
 * Catálogo de acontecimientos narrativos.
 *
 * Punto de partida deliberadamente pequeño y genérico. El documento de
 * diseño (sección 3.4) describe un motor de acontecimientos condicionado
 * por relaciones, ubicación, profesión, política y facciones — ninguno de
 * esos sistemas existe todavía, así que estos acontecimientos son
 * genéricos y no dependen de nada del estado del personaje más allá de
 * que exista.
 *
 * `text` puede usar {name} como marcador de sustitución por el nombre del
 * personaje.
 *
 * `traitEffect` (opcional) representa un rasgo cambiando por una
 * experiencia vital concreta (sección 9.7: los rasgos pueden fortalecerse,
 * debilitarse, desaparecer o evolucionar). A diferencia de la aparición
 * normal de rasgos (ponderada por personalidad, en traits-engine.js), este
 * efecto es directo: el acontecimiento en sí mismo es la causa del cambio.
 * - type: "add" añade `traitId` (quitando antes `removesTraitId`, si el
 *   personaje lo tenía — representa una superación o un quiebre, no una
 *   contradicción).
 * - type: "remove" quita `traitId` si el personaje lo tenía.
 */

export const EVENTS = [
  {
    id: "conocio_viajero",
    text: "{name} conoció a un viajero con historias de tierras lejanas.",
  },
  {
    id: "tormenta",
    text: "Una fuerte tormenta azotó la región donde vivía {name}.",
  },
  {
    id: "enfermedad_leve",
    text: "{name} pasó una enfermedad leve, de la que se recuperó sin mayores problemas.",
  },
  {
    id: "buena_cosecha",
    text: "Una cosecha especialmente buena mejoró el ánimo de la comunidad de {name}.",
  },
  {
    id: "perdida_objeto",
    text: "{name} perdió un objeto personal de valor sentimental.",
  },
  {
    id: "festival_local",
    text: "Un festival local dio a {name} un breve respiro de la rutina.",
  },
  {
    id: "acto_heroico",
    text: "{name} afrontó un peligro real y salió fortalecido de ello.",
    traitEffect: { type: "add", traitId: "valiente", removesTraitId: "cobarde" },
  },
  {
    id: "humillacion_publica",
    text: "{name} vivió una humillación pública que hizo mella en su confianza.",
    traitEffect: { type: "add", traitId: "cobarde", removesTraitId: "valiente" },
  },
  {
    id: "traicion_cercana",
    text: "Alguien cercano a {name} le traicionó, dejándole más receloso que antes.",
    traitEffect: { type: "add", traitId: "desconfiado" },
  },
];

export function getEventById(id) {
  return EVENTS.find((event) => event.id === id);
}