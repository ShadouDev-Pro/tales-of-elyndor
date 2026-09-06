import { getLeafSkills } from "./skills.js";

// Igual que con los atributos, la habilidad tiene un techo suave (100)
// hacia el que la probabilidad de subir tiende a cero, sin ser un límite
// absoluto.
const SOFT_CAP = 100;
const BASE_PRACTICE_CHANCE = 0.4;

/**
 * Resuelve una sesión de práctica de una habilidad concreta. Devuelve el
 * nuevo valor (puede ser igual al actual si no hay suerte esta vez).
 */
export function practiceSkill(currentValue) {
  const saturationFactor = Math.max(0, (SOFT_CAP - currentValue) / 100);
  const chance = BASE_PRACTICE_CHANCE * saturationFactor;
  const increased = Math.random() < chance;
  return currentValue + (increased ? 1 : 0);
}

export function isValidLeafSkill(skillId) {
  return getLeafSkills().some((skill) => skill.id === skillId);
}