/**
 * Muerte por vejez (documento de diseño, sección 9.13).
 *
 * Antes de alcanzar la esperanza de vida de la raza, no hay ninguna
 * probabilidad de muerte por esta causa. A partir de ahí, la
 * probabilidad por año sube un 15% por cada año de más, hasta ser
 * prácticamente segura hacia el séptimo año de más.
 *
 * Es un punto de partida ajustable: no representa peligro, combate ni
 * enfermedad — solo el paso natural del tiempo, que es lo único que
 * existe en el juego por ahora.
 */

const DEATH_CHANCE_PER_EXCESS_YEAR = 0.15;
const DAYS_PER_YEAR = 365;

function yearlyDeathChance(ageYears, lifeExpectancy) {
  if (ageYears < lifeExpectancy) return 0;
  const excessYears = ageYears - lifeExpectancy + 1;
  return Math.min(1, excessYears * DEATH_CHANCE_PER_EXCESS_YEAR);
}

/**
 * Comprueba, año a año dentro del rango de días avanzado, si el
 * personaje muere de vejez. Devuelve `{ died, ageDaysAtDeath }` — si
 * `died` es false, `ageDaysAtDeath` es null.
 *
 * Recorremos año a año (no de una vez) para que un salto grande en el
 * tiempo (ej. avanzar 10 años de golpe) no se salte por error el año
 * exacto en el que ocurrió la muerte.
 */
export function checkDeathByOldAge(currentAgeDays, days, lifeExpectancy) {
  let ageDays = currentAgeDays;
  const targetAgeDays = currentAgeDays + days;

  while (ageDays < targetAgeDays) {
    const nextYearMark = ageDays + DAYS_PER_YEAR;
    const ageYearsAtThisPoint = Math.floor(nextYearMark / DAYS_PER_YEAR);
    const chance = yearlyDeathChance(ageYearsAtThisPoint, lifeExpectancy);

    if (Math.random() < chance) {
      return { died: true, ageDaysAtDeath: Math.min(nextYearMark, targetAgeDays) };
    }

    ageDays = nextYearMark;
  }

  return { died: false, ageDaysAtDeath: null };
}

export const DEATH_CAUSE_OLD_AGE = "Falleció de causas naturales, propias de su avanzada edad.";