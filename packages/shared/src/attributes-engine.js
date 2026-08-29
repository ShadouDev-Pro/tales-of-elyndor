import { ATTRIBUTE_IDS } from "./attributes.js";
import { getRaceById } from "./races.js";

// Ritmo base de crecimiento por año, antes de aplicar el potencial y el
// techo suave. Es un valor de partida pensado para ajustarse con calma
// una vez se pruebe en la práctica.
const BASE_GROWTH_RATE_PER_YEAR = 0.15;

// Techo suave: no es un límite absoluto, sino un valor hacia el que la
// probabilidad de subir tiende a cero. Es el mismo para todos los
// atributos y todas las razas — el potencial de cada atributo decide
// solo la VELOCIDAD de acercarse a él, nunca si se puede superar.
const SOFT_CAP = 100;

const DAYS_PER_YEAR = 365;

// Esperanza de vida usada como referencia (humana) para calibrar la
// subida garantizada en otras razas.
const REFERENCE_LIFE_EXPECTANCY = 70;

function growthChance(actual, potencial, years) {
  const speedFactor = potencial / 100;
  const saturationFactor = Math.max(0, (SOFT_CAP - actual) / 100);
  return speedFactor * BASE_GROWTH_RATE_PER_YEAR * saturationFactor * years;
}

// Elige un atributo al azar para la subida garantizada, dando más peso a
// los que tienen mayor potencial.
function pickWeightedAttribute(attributes) {
  const weights = ATTRIBUTE_IDS.map((id) => attributes[id].potencial);
  const total = weights.reduce((sum, weight) => sum + weight, 0);

  let roll = Math.random() * total;
  for (const id of ATTRIBUTE_IDS) {
    roll -= attributes[id].potencial;
    if (roll <= 0) return id;
  }
  return ATTRIBUTE_IDS[ATTRIBUTE_IDS.length - 1];
}

// Procesa un único año real de crecimiento probabilístico normal, y aplica
// la subida garantizada (con la probabilidad ya ajustada por longevidad)
// si ningún atributo subió por su cuenta.
function growOneRealYear(attributes, guaranteeProbability) {
  const updated = {};
  let anyGrew = false;

  for (const id of ATTRIBUTE_IDS) {
    const { actual, potencial } = attributes[id];
    const grew = Math.random() < growthChance(actual, potencial, 1);
    if (grew) anyGrew = true;
    updated[id] = { actual: actual + (grew ? 1 : 0), potencial };
  }

  if (!anyGrew && Math.random() < guaranteeProbability) {
    const chosenId = pickWeightedAttribute(attributes);
    updated[chosenId] = {
      ...updated[chosenId],
      actual: updated[chosenId].actual + 1,
    };
  }

  return updated;
}

// Crecimiento probabilístico para un período menor a un año (sin garantía:
// la garantía solo tiene sentido a escala de años completos).
function growPartialYear(attributes, years) {
  const updated = {};

  for (const id of ATTRIBUTE_IDS) {
    const { actual, potencial } = attributes[id];
    const expected = growthChance(actual, potencial, years);
    const guaranteed = Math.floor(expected);
    const remainder = expected - guaranteed;
    const bonus = Math.random() < remainder ? 1 : 0;
    updated[id] = { actual: actual + guaranteed + bonus, potencial };
  }

  return updated;
}

/**
 * Hace crecer los atributos de un personaje tras avanzar `days` días.
 *
 * Combina crecimiento probabilístico normal por atributo (según potencial
 * y el techo suave) con una posibilidad de subida GARANTIZADA de 1 punto
 * en algún atributo cada año real, para que ningún personaje se quede
 * sin progresar nada durante mucho tiempo por pura mala suerte.
 *
 * Esa garantía se adapta a la longevidad de la raza (usando los humanos,
 * con ~70 años de vida, como referencia): una raza el doble de longeva
 * tiene solo la mitad de probabilidad de que la garantía se active cada
 * año, para que el ritmo de mejora sea comparable en relación a toda su
 * vida, en vez de acumular siglos de subidas garantizadas.
 */
export function growAttributes(days, attributes, raceId) {
  const race = getRaceById(raceId);
  const lifeExpectancy = race?.biology?.lifespan?.lifeExpectancy ?? REFERENCE_LIFE_EXPECTANCY;
  const guaranteeProbability = Math.min(1, REFERENCE_LIFE_EXPECTANCY / lifeExpectancy);

  const wholeYears = Math.floor(days / DAYS_PER_YEAR);
  const leftoverDays = days % DAYS_PER_YEAR;

  let current = attributes;
  for (let i = 0; i < wholeYears; i++) {
    current = growOneRealYear(current, guaranteeProbability);
  }

  if (leftoverDays > 0) {
    current = growPartialYear(current, leftoverDays / DAYS_PER_YEAR);
  }

  return current;
}