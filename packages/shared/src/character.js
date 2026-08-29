import { ATTRIBUTES } from "./attributes.js";
import { getRaceById } from "./races.js";
import { PERSONALITY_DIMENSIONS } from "./personality.js";

const BASE_ATTRIBUTE_VALUE = 10;
const BASE_POTENTIAL_VALUE = 60;
const RANDOM_VARIATION = 4; // variación aleatoria +/- al generar un atributo

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Genera el bloque de atributos inicial de un personaje para una raza dada.
 *
 * Cada atributo tiene un valor `actual` (nivel presente) y un `potencial`
 * (velocidad natural para desarrollar ese atributo con el tiempo — no un
 * límite: el propio motor de crecimiento, en attributes-engine.js, usa un
 * techo suave común a todos los personajes, y el potencial solo decide
 * cuán rápido se acercan a él). Las afinidades raciales desplazan
 * ligeramente el potencial de partida, sin imponer límites absolutos.
 */
export function generateAttributes(raceId) {
  const race = getRaceById(raceId);
  const affinities = race?.attributeAffinities ?? {};

  return ATTRIBUTES.reduce((attributes, attribute) => {
    const affinityBonus = affinities[attribute.id] ?? 0;
    const actual = randomInt(
      BASE_ATTRIBUTE_VALUE - RANDOM_VARIATION,
      BASE_ATTRIBUTE_VALUE + RANDOM_VARIATION
    );
    const potencial = randomInt(
      BASE_POTENTIAL_VALUE - RANDOM_VARIATION,
      BASE_POTENTIAL_VALUE + RANDOM_VARIATION
    ) + affinityBonus * 5;

    attributes[attribute.id] = { actual, potencial };
    return attributes;
  }, {});
}

const PERSONALITY_MIN = 0;
const PERSONALITY_MAX = 100;

/**
 * Genera los valores de personalidad de un personaje. A diferencia de los
 * atributos, no dependen de la raza (el documento no describe afinidades
 * raciales de personalidad, solo de atributos) — son un punto de partida
 * puramente individual.
 */
export function generatePersonality() {
  return PERSONALITY_DIMENSIONS.reduce((personality, dimension) => {
    personality[dimension.id] = randomInt(PERSONALITY_MIN, PERSONALITY_MAX);
    return personality;
  }, {});
}

/**
 * Crea un personaje inicial a partir de una raza y unos datos básicos.
 * Este es un punto de partida deliberadamente simple: rasgos, personalidad,
 * habilidades y origen se irán añadiendo de forma incremental.
 */
export function createCharacter({ name, raceId, sex, birthRegion }) {
  const race = getRaceById(raceId);
  if (!race) {
    throw new Error(`Raza desconocida: ${raceId}`);
  }
  if (!race.playable) {
    throw new Error(`La raza "${race.name}" no es jugable.`);
  }

  return {
    name,
    raceId,
    sex,
    birthRegion: birthRegion ?? null,
    ageDays: yearsToDays(race.biology.lifespan.maturityAge ?? 16),
    attributes: generateAttributes(raceId),
    personality: generatePersonality(),
    traits: [],
    skills: [],
  };
}


const DAYS_PER_YEAR = 365;

export function yearsToDays(years) {
  return Math.round(years * DAYS_PER_YEAR);
}

export function daysToYears(days) {
  return Math.floor(days / DAYS_PER_YEAR);
}