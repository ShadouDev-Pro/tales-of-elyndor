/**
 * Acontecimientos de infancia (documento de diseño, sección 2.4).
 *
 * Catálogo independiente del de vida adulta (events.js): temática y
 * consecuencias propias de la niñez. Algunos incluyen `skillEffect`
 * (aprendizajes tempranos, ej. un veterano enseñando espada), algo que
 * los acontecimientos de vida adulta todavía no usan.
 *
 * `text` puede usar {name}.
 */

export const CHILDHOOD_EVENTS = [
  {
    id: "mala_cosecha",
    text: "Una mala cosecha dejó a la familia de {name} en una situación económica complicada.",
  },
  {
    id: "madre_enferma",
    text: "La madre de {name} enfermó, y {name} pasó varios meses ayudándola.",
    traitEffect: { type: "add", traitId: "generoso" },
  },
  {
    id: "veterano_ensena_espada",
    text: "Un soldado retirado de la aldea comenzó a enseñar a {name} a usar una espada.",
    skillEffect: { skillId: "combate_espadas", amount: 8 },
  },
  {
    id: "mudanza_ciudad",
    text: "La familia de {name} abandonó la aldea y se trasladó a una ciudad.",
  },
  {
    id: "amistad_infancia",
    text: "{name} forjó una amistad entrañable con otro niño de la aldea.",
    traitEffect: { type: "add", traitId: "carismatico" },
  },
  {
    id: "curiosidad_temprana",
    text: "{name} pasaba horas explorando cada rincón cercano a su hogar.",
    traitEffect: { type: "add", traitId: "curioso" },
  },
];

export function getChildhoodEventById(id) {
  return CHILDHOOD_EVENTS.find((event) => event.id === id);
}