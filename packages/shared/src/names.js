/**
 * Nombres para NPCs generados (parejas, hijos). Es un catálogo mínimo,
 * pensado para ampliarse — no hay generador procedural de nombres
 * todavía, así que elegimos al azar de una lista fija.
 */

export const MALE_NAMES = ["Aldren", "Bram", "Cedric", "Dorin", "Elric", "Fenwick", "Gareth"];
export const FEMALE_NAMES = ["Aveline", "Brenna", "Ciara", "Delia", "Elara", "Fiora", "Ginevra"];

export function generateName(sex) {
  const list = sex === "masculino" ? MALE_NAMES : FEMALE_NAMES;
  return list[Math.floor(Math.random() * list.length)];
}

export function oppositeSex(sex) {
  return sex === "masculino" ? "femenino" : "masculino";
}