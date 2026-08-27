/**
 * Razas y pueblos del mundo de Tales of Elyndor.
 *
 * Principio fundamental (documento de diseño, sección 4.1):
 *   "La raza modifica el punto de partida, pero nunca determina el destino."
 *
 * La raza determina biología, esperanza de vida, ritmo de maduración y
 * predisposiciones naturales. NO determina profesión, clase, cultura,
 * religión, personalidad ni destino.
 *
 * Los valores de `lifespan` (childhoodYears, maturityAge, lifeExpectancy) y
 * los `attributeAffinities` son estimaciones iniciales para poder arrancar
 * la simulación; el documento de diseño no fija cifras exactas salvo para
 * los elfos, así que estos números están pensados como punto de partida
 * ajustable, no como valores definitivos.
 */

export const RACES = [
  {
    id: "humano",
    name: "Humanos",
    playable: true,
    concept:
      "Pueblo ampliamente distribuido por el continente, caracterizado por su adaptabilidad y diversidad cultural.",
    biology: {
      lifespan: {
        childhoodYears: 12,
        maturityAge: 16,
        lifeExpectancy: 70,
      },
      notes: [
        "Esperanza de vida similar a la humana histórica.",
        "Maduración relativamente temprana.",
        "Gran variedad física individual.",
        "Sin especialización biológica extrema.",
      ],
    },
    culture: {
      notes: [
        "No existe una única cultura humana.",
        "Pueden existir reinos, ciudades-estado, distintos sistemas políticos, culturas regionales y religiones diversas.",
      ],
    },
    attributeAffinities: {},
  },
  {
    id: "elfo",
    name: "Elfos",
    playable: true,
    concept: "Pueblo longevo, aislado y marcado por una fuerte tradición cultural.",
    biology: {
      lifespan: {
        childhoodYears: 40,
        maturityAge: 50,
        lifeExpectancy: 350,
      },
      notes: [
        "Esperanza de vida aproximada: 300-400 años.",
        "Maduración más lenta que la humana.",
        "Mayor longevidad.",
        "Predisposiciones físicas y sensoriales propias.",
        "Aprenden de forma más lenta que los humanos, pero esto no implica que aprendan peor: la velocidad de aprendizaje y el potencial de dominio son conceptos diferentes.",
      ],
    },
    culture: {
      notes: [
        "La mayoría nace dentro de comunidades élficas; los nacimientos fuera de ellas son extremadamente raros.",
        "Mantienen un considerable aislamiento respecto a otros pueblos.",
        "Tendencia cultural hacia el elitismo, sin que esto implique que todos los individuos la compartan.",
      ],
    },
    attributeAffinities: { percepcion: 1 },
  },
  {
    id: "enano",
    name: "Enanos",
    playable: true,
    concept: "Pueblo robusto con una tradición tecnológica y artesanal extraordinariamente desarrollada.",
    biology: {
      lifespan: {
        childhoodYears: 20,
        maturityAge: 25,
        lifeExpectancy: 250,
      },
      notes: [
        "Mayor longevidad que los humanos.",
        "Maduración más lenta.",
        "Constitución robusta y gran resistencia física.",
        "Adaptación a entornos montañosos y subterráneos.",
      ],
    },
    culture: {
      notes: [
        "Fuerte tradición de conservación y transmisión del conocimiento.",
        "Destacan en metalurgia, ingeniería, arquitectura, minería, artesanía, construcción y mecánica.",
        "Tecnología avanzada dentro del contexto medieval fantástico, sin estética steampunk ni industrial moderna.",
      ],
    },
    attributeAffinities: { fuerza: 1, resistencia: 1 },
  },
  {
    id: "mediano",
    name: "Medianos",
    playable: true,
    concept:
      "Pueblo de pequeñas comunidades tradicionalmente rurales que ha desarrollado una importante tradición comercial y viajera.",
    biology: {
      lifespan: {
        childhoodYears: 10,
        maturityAge: 14,
        lifeExpectancy: 75,
      },
      notes: [],
    },
    culture: {
      notes: [
        "Gran importancia de la familia y fuerte sentido de comunidad.",
        "Hospitalidad, agricultura, comercio y viajes.",
        "Redes familiares y comerciales extensas.",
        "Predisposición natural hacia la negociación, el comercio y las relaciones interpersonales.",
        "No poseen una predisposición sobrenatural hacia la suerte. No todos son comerciantes o viajeros.",
      ],
    },
    attributeAffinities: { percepcion: 1 },
  },
  {
    id: "gnomo",
    name: "Gnomos",
    playable: true,
    concept: "Pueblo de naturaleza feérica con una conexión natural con la magia.",
    biology: {
      lifespan: {
        childhoodYears: 15,
        maturityAge: 20,
        lifeExpectancy: 150,
      },
      notes: [],
    },
    culture: {
      notes: [
        "Principal especialización cultural: la alquimia.",
        "Destacan en investigación, experimentación, sustancias medicinales, venenos, pociones y la interacción entre alquimia y magia.",
        "La alquimia no es necesariamente magia: puede producir efectos completamente mundanos o interactuar con fenómenos mágicos.",
        "No todos los gnomos son alquimistas ni todos son capaces de utilizar magia.",
      ],
    },
    attributeAffinities: { intelecto: 1 },
  },
  {
    id: "orco",
    name: "Orcos",
    playable: true,
    concept: "Pueblo físicamente poderoso cuya cultura está profundamente relacionada con la fuerza y la superación personal.",
    biology: {
      lifespan: {
        childhoodYears: 10,
        maturityAge: 14,
        lifeExpectancy: 60,
      },
      notes: [],
    },
    culture: {
      notes: [
        "La fuerza constituye una importante fuente de prestigio y respeto.",
        "Fuerte cultura competitiva y de superación.",
        "Las demostraciones de poder pueden ser honorables para su cultura, pero interpretarse como agresiones por otros pueblos.",
        "No son inherentemente malvados; su conflictividad procede de diferencias culturales. Un orco puede desarrollar cualquier profesión.",
      ],
    },
    attributeAffinities: { fuerza: 1 },
  },
  {
    id: "goblin",
    name: "Goblins",
    playable: true,
    concept: "Pueblo astuto, oportunista y conflictivo cuya cultura valora especialmente el ingenio.",
    biology: {
      lifespan: {
        childhoodYears: 8,
        maturityAge: 12,
        lifeExpectancy: 50,
      },
      notes: [],
    },
    culture: {
      notes: [
        "Tendencia cultural hacia la astucia, el oportunismo, los robos, las travesuras, el vandalismo, las estafas y las soluciones poco convencionales.",
        "Las acciones ingeniosas o arriesgadas pueden dar prestigio dentro de la comunidad.",
        "No son inherentemente malvados ni todos criminales; la cultura goblin también produce comerciantes, exploradores, artesanos, espías y aventureros.",
      ],
    },
    attributeAffinities: { agilidad: 1 },
  },
  {
    id: "troll",
    name: "Trolls",
    playable: true,
    concept:
      "Pueblo longevo y resistente, con una extraordinaria capacidad regenerativa y una civilización principalmente asentada en regiones selváticas.",
    biology: {
      lifespan: {
        childhoodYears: 18,
        maturityAge: 22,
        lifeExpectancy: 200,
      },
      notes: [
        "Inteligencia comparable a la humana.",
        "Gran longevidad y envejecimiento lento.",
        "Regeneración extraordinaria (no implica invulnerabilidad).",
        "Gran resistencia física.",
        "Adaptación a ambientes cálidos y húmedos.",
      ],
    },
    culture: {
      notes: [
        "Principales núcleos de población en junglas.",
        "Cultura inspirada en civilizaciones mesoamericanas, pero completamente original dentro del mundo.",
        "Destacan en arquitectura monumental, grandes templos, pirámides escalonadas, astronomía, calendarios y culto solar.",
        "El Sol tiene una importancia fundamental en su cosmovisión; la longevidad les permite acumular grandes conocimientos astronómicos.",
      ],
    },
    attributeAffinities: { resistencia: 1 },
  },
  {
    id: "beastfolk_felino",
    name: "Beastfolk felinos",
    playable: true,
    concept: "Pueblo de características felinas adaptado a la vida en la jungla, estrechamente relacionado con las sociedades troll.",
    biology: {
      lifespan: {
        childhoodYears: 10,
        maturityAge: 14,
        lifeExpectancy: 70,
      },
      notes: [
        "Gran agilidad, reflejos desarrollados y buen equilibrio.",
        "Sentidos agudos y capacidad para moverse silenciosamente.",
        "Buena adaptación a condiciones de poca iluminación.",
      ],
    },
    culture: {
      notes: [
        "Especial afinidad por la noche, la luna, las estrellas, el silencio, la observación y la exploración nocturna.",
        "Relación generalmente armoniosa con los trolls, con quienes comparten territorios selváticos sin subordinación entre ambos pueblos.",
      ],
    },
    attributeAffinities: { agilidad: 1, percepcion: 1 },
  },
  {
    id: "dragon",
    name: "Dragones",
    playable: false,
    concept:
      "Pueblo del mundo, no jugable. Su inteligencia y comportamiento varían enormemente según la edad del individuo.",
    biology: {
      lifespan: {
        childhoodYears: null,
        maturityAge: null,
        lifeExpectancy: null,
      },
      notes: [
        "Los dragones jóvenes pueden comportarse principalmente como criaturas territoriales.",
        "Los individuos extremadamente antiguos pueden poseer inteligencia extraordinaria, personalidad compleja y conocimientos acumulados durante siglos.",
        "No constituyen necesariamente una civilización completamente unificada.",
      ],
    },
    culture: {
      notes: [
        "Un dragón puede ser salvaje, territorial, aislado, protector, comerciante, gobernante, venerado o temido.",
        "Su existencia será poco frecuente y su aparición no está garantizada en todas las partidas.",
      ],
    },
    attributeAffinities: {},
  },
];

export const PLAYABLE_RACES = RACES.filter((race) => race.playable);

export function getRaceById(id) {
  return RACES.find((race) => race.id === id);
}
