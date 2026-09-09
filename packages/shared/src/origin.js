/**
 * Origen del personaje (documento de diseño, sección 2.3).
 *
 * Por ahora se genera siempre al azar, sin que el jugador pueda elegirlo
 * directamente — el documento habla de una futura "creación personalizada"
 * donde sí podría intervenir, pero esa parte queda para más adelante.
 *
 * Catálogos deliberadamente pequeños, pensados para ampliarse con calma.
 */

export const SOCIAL_CLASSES = [
  { id: "baja", name: "Clase baja" },
  { id: "media", name: "Clase media" },
  { id: "alta", name: "Clase alta" },
];

export const ECONOMIC_SITUATIONS = [
  { id: "precaria", name: "Precaria" },
  { id: "ajustada", name: "Ajustada" },
  { id: "estable", name: "Estable" },
  { id: "acomodada", name: "Acomodada" },
];

export const EDUCATION_LEVELS = [
  { id: "ninguna", name: "Sin educación formal" },
  { id: "basica", name: "Educación básica" },
  { id: "formal", name: "Educación formal" },
];

export const RELIGION_LEVELS = [
  { id: "devoto", name: "Devoto" },
  { id: "practicante_ocasional", name: "Practicante ocasional" },
  { id: "no_creyente", name: "No creyente" },
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Genera un origen aleatorio. Cada categoría se elige de forma
 * independiente por ahora (sin correlación entre, por ejemplo, clase
 * social y situación económica) — es un punto de partida simple que se
 * puede refinar más adelante si hace falta más coherencia entre campos.
 */
export function generateOrigin() {
  return {
    socialClass: pickRandom(SOCIAL_CLASSES).id,
    economicSituation: pickRandom(ECONOMIC_SITUATIONS).id,
    education: pickRandom(EDUCATION_LEVELS).id,
    religion: pickRandom(RELIGION_LEVELS).id,
  };
}