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
 * experiencia vital concreta (sección 9.7). Ver traits.js.
 *
 * `attributeEffect` (opcional) representa un atributo cambiando de forma
 * directa por una experiencia vital concreta:
 * - `permanent: true` → el cambio es definitivo (ej. entrenamiento, que
 *   suma directamente al `actual` del atributo).
 * - `permanent: false` → el cambio es temporal (ej. una lesión), y se
 *   aplica como un modificador aparte con una fecha de caducidad (en
 *   `durationDays`), sin alterar el `actual` real del atributo.
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
  {
    id: "entrenamiento_intenso",
    text: "{name} completó un período de entrenamiento físico especialmente intenso.",
    attributeEffect: { attributeId: "fuerza", amount: 3, permanent: true },
  },
  {
    id: "estudio_profundo",
    text: "{name} pasó una larga temporada dedicada al estudio profundo.",
    attributeEffect: { attributeId: "intelecto", amount: 3, permanent: true },
  },
  {
    id: "lesion_grave",
    text: "{name} sufrió una lesión grave de la que tardará un tiempo en recuperarse.",
    attributeEffect: { attributeId: "resistencia", amount: -3, permanent: false, durationDays: 730 },
  },
];

export function getEventById(id) {
  return EVENTS.find((event) => event.id === id);
}