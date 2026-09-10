/**
 * Eventos de relación personal (amistad de pareja, matrimonio, hijos).
 * No están en el documento de diseño — es un sistema que hemos diseñado
 * juntos para dar sentido real al modo de partida "Linaje".
 *
 * Cada evento requiere un `requiresStatus` (el estado de relación que
 * debe tener el personaje para que pueda ocurrir) y produce un
 * `resultStatus` (el estado al que pasa tras el evento). Solo se
 * permiten parejas heterosexuales, por decisión explícita: la pareja
 * generada siempre es del sexo opuesto al del personaje.
 */

export const RELATIONSHIP_EVENTS = [
  {
    id: "conocio_pareja",
    requiresStatus: "soltero",
    resultStatus: "conociendo",
    text: "{name} conoció a alguien que despertó su interés.",
  },
  {
    id: "relacion_se_afianza",
    requiresStatus: "conociendo",
    resultStatus: "pareja",
    text: "{name} y {partnerName} formalizaron su relación.",
  },
  {
    id: "relacion_termina",
    requiresStatus: "conociendo",
    resultStatus: "soltero",
    text: "{name} y {partnerName} decidieron no seguir adelante.",
  },
  {
    id: "nace_hijo",
    requiresStatus: "pareja",
    resultStatus: "pareja",
    text: "{name} y {partnerName} tuvieron un hijo: {childName}.",
    createsChild: true,
  },
];

export function getRelationshipEventsForStatus(status) {
  return RELATIONSHIP_EVENTS.filter((event) => event.requiresStatus === status);
}