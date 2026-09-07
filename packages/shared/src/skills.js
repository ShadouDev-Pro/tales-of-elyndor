/**
 * Catálogo de habilidades del juego (documento de diseño, sección 9.4).
 *
 * Organizadas jerárquicamente: cada habilidad tiene un `parentId` que
 * apunta a su habilidad "padre" (o `null` si es una familia raíz). La
 * misma habilidad hoja puede existir bajo distintas familias con
 * significados distintos (ej. "Espadas" de combate no es lo mismo que
 * "Espadas" de herrería) — por eso cada una tiene su propio `id` único,
 * aunque compartan nombre de visualización.
 *
 * Punto de partida deliberadamente pequeño: dos árboles de ejemplo
 * tomados directamente del documento. La lista es cerrada por diseño
 * (sección 9.4: "no existirán habilidades generadas arbitrariamente
 * durante una partida"), pero se ampliará con el tiempo.
 */

export const SKILLS = [
  { id: "combate", name: "Combate", parentId: null },
  { id: "combate_cuerpo_a_cuerpo", name: "Armas cuerpo a cuerpo", parentId: "combate" },
  { id: "combate_espadas", name: "Espadas", parentId: "combate_cuerpo_a_cuerpo" },

  { id: "artesania", name: "Artesanía", parentId: null },
  { id: "artesania_herreria", name: "Herrería", parentId: "artesania" },
  { id: "artesania_fabricacion_armas", name: "Fabricación de armas", parentId: "artesania_herreria" },
  { id: "artesania_espadas", name: "Espadas", parentId: "artesania_fabricacion_armas" },
];

export function getSkillById(id) {
  return SKILLS.find((skill) => skill.id === id);
}

/** Solo las habilidades "hoja" (sin hijos) son las que un personaje puede practicar directamente. */
export function getLeafSkills() {
  const parentIds = new Set(SKILLS.map((skill) => skill.parentId).filter(Boolean));
  return SKILLS.filter((skill) => !parentIds.has(skill.id));
}

/** Devuelve la cadena completa desde la raíz hasta la habilidad, ej. ["Combate", "Armas cuerpo a cuerpo", "Espadas"]. */
export function getSkillPath(id) {
  const path = [];
  let current = getSkillById(id);
  while (current) {
    path.unshift(current.name);
    current = current.parentId ? getSkillById(current.parentId) : null;
  }
  return path;
}