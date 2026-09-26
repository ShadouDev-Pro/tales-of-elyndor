/**
 * Catálogo de decisiones narrativas.
 *
 * A diferencia de los acontecimientos (events.js), una decisión no se
 * resuelve sola: presenta 2+ opciones al jugador, cada una ligada a un
 * atributo y una dificultad, resueltas con el motor de tiradas
 * (rolls.js) al elegir.
 *
 * Punto de partida deliberadamente pequeño y narrativo: por ahora el
 * resultado es solo texto (sin efectos sobre rasgos/atributos), para
 * ver cómo se siente jugarlo antes de añadir mecánica extra.
 *
 * `text` y los textos de resultado pueden usar {name}.
 */

export const DECISIONS = [
  {
    id: "encrucijada_bosque",
    prompt:
      "El camino se bifurca ante {name}: un sendero angosto entre los árboles, o un desvío más largo pero despejado.",
    options: [
      {
        id: "atajo",
        label: "Tomar el atajo por el bosque",
        attributeId: "agilidad",
        difficulty: 12,
        successText:
          "{name} avanzó con destreza entre la maleza y ganó tiempo valioso.",
        failureText:
          "{name} tropezó varias veces entre las raíces y llegó agotado.",
        successEffect: {
          attributeEffect: {
            attributeId: "agilidad",
            amount: 1,
            permanent: true,
          },
        },
        failureEffect: {
          attributeEffect: {
            attributeId: "resistencia",
            amount: -2,
            permanent: false,
            durationDays: 60,
          },
        },
      },
      {
        id: "rodeo",
        label: "Tomar el camino largo",
        attributeId: "resistencia",
        difficulty: 10,
        successText: "{name} aguantó el largo trayecto sin mayor problema.",
        failureText:
          "{name} llegó exhausto tras la caminata, con los pies destrozados.",
        failureEffect: {
          attributeEffect: {
            attributeId: "resistencia",
            amount: -2,
            permanent: false,
            durationDays: 60,
          },
        },
      },
    ],
  },
  {
    id: "disputa_mercado",
    prompt:
      "Un comerciante acusa a {name}, quizás sin razón, de haber intentado robarle.",
    options: [
      {
        id: "convencer",
        label: "Intentar convencerlo con palabras",
        attributeId: "percepcion",
        difficulty: 13,
        successText:
          "{name} logró calmar al comerciante y aclarar el malentendido.",
        failureText:
          "{name} no logró convencerlo, y la escena atrajo miradas incómodas.",
        successEffect: { traitEffect: { type: "add", traitId: "carismatico" } },
        failureEffect: {
          traitEffect: {
            type: "add",
            traitId: "desconfiado",
            removesTraitId: "confiado",
          },
        },
      },
      {
        id: "plantar_cara",
        label: "Plantarle cara con firmeza",
        attributeId: "voluntad",
        difficulty: 14,
        successText:
          "{name} se mantuvo firme y el comerciante acabó retrocediendo.",
        failureText:
          "{name} perdió los nervios, y la disputa escaló más de la cuenta.",
        successEffect: {
          traitEffect: {
            type: "add",
            traitId: "valiente",
            removesTraitId: "cobarde",
          },
        },
        failureEffect: {
          traitEffect: {
            type: "add",
            traitId: "cobarde",
            removesTraitId: "valiente",
          },
        },
      },
    ],
  },
  {
    id: "oferta_trabajo",
    prompt:
      "A {name} le ofrecen dos trabajos temporales para ganarse el sustento.",
    options: [
      {
        id: "carga",
        label: "Trabajo de carga y transporte",
        attributeId: "fuerza",
        difficulty: 11,
        successText:
          "{name} completó el trabajo sin problemas y ganó algo de reputación.",
        failureText:
          "{name} terminó agotado y con poco que mostrar por su esfuerzo.",
        successEffect: {
          attributeEffect: {
            attributeId: "fuerza",
            amount: 1,
            permanent: true,
          },
        },
      },
      {
        id: "escribiente",
        label: "Trabajo de escribiente",
        attributeId: "intelecto",
        difficulty: 12,
        successText:
          "{name} demostró buena mano con la pluma y quedó bien considerado.",
        failureText:
          "{name} cometió varios errores que no pasaron desapercibidos.",
        successEffect: {
          attributeEffect: {
            attributeId: "intelecto",
            amount: 1,
            permanent: true,
          },
        },
      },
    ],
  },
  {
    id: "rivalidad_taberna",
    prompt:
      "Un desconocido reta a {name} en la taberna, ante la mirada de los presentes.",
    options: [
      {
        id: "pulso",
        label: "Aceptar un pulso de fuerza",
        attributeId: "fuerza",
        difficulty: 13,
        successText: "{name} ganó el pulso entre vítores.",
        failureText: "{name} perdió el pulso, para diversión de los presentes.",
        successEffect: {
          traitEffect: {
            type: "add",
            traitId: "valiente",
            removesTraitId: "cobarde",
          },
        },
      },
      {
        id: "ingenio",
        label: "Responder con ingenio en vez de fuerza",
        attributeId: "percepcion",
        difficulty: 12,
        successText:
          "{name} salió airoso con una réplica que hizo reír a todos.",
        failureText:
          "{name} no supo qué responder, y el momento resultó incómodo.",
        successEffect: { traitEffect: { type: "add", traitId: "carismatico" } },
      },
    ],
  },
  {
    id: "encargo_forja",
    requires: { raceId: "enano" },
    prompt:
      "Un artesano de la comunidad pide ayuda a {name} para terminar un encargo importante antes del festival.",
    options: [
      {
        id: "ayudar_forja",
        label: "Ayudar en la forja",
        attributeId: "fuerza",
        difficulty: 13,
        successText:
          "{name} ayudó a terminar el encargo a tiempo, ganándose el respeto del artesano.",
        failureText: "{name} no dio la talla, y el encargo se entregó tarde.",
        successEffect: {
          attributeEffect: {
            attributeId: "fuerza",
            amount: 2,
            permanent: true,
          },
        },
      },
      {
        id: "rechazar_forja",
        label: "Rechazar la petición",
        attributeId: "voluntad",
        difficulty: 9,
        successText: "{name} declinó sin generar mala sangre.",
        failureText: "El artesano no se tomó bien la negativa de {name}.",
        failureEffect: { traitEffect: { type: "add", traitId: "desconfiado" } },
      },
    ],
  },
  {
    id: "biblioteca_ancestral",
    requires: { raceId: "elfo" },
    prompt:
      "{name} descubre acceso a un antiguo archivo élfico, celosamente guardado.",
    options: [
      {
        id: "investigar",
        label: "Investigar los archivos a fondo",
        attributeId: "intelecto",
        difficulty: 14,
        successText:
          "{name} encontró conocimiento que pocos habían visto en generaciones.",
        failureText:
          "{name} no logró descifrar gran cosa antes de que le pidieran retirarse.",
        successEffect: { traitEffect: { type: "add", traitId: "curioso" } },
      },
      {
        id: "hojear",
        label: "Ojear brevemente y no llamar la atención",
        attributeId: "percepcion",
        difficulty: 10,
        successText: "{name} echó un vistazo discreto sin levantar sospechas.",
        failureText:
          "{name} fue descubierto husmeando y tuvo que dar explicaciones.",
      },
    ],
  },
  {
    id: "propuesta_ensenanza",
    requires: { education: "formal" },
    prompt:
      "Dada su formación, proponen a {name} enseñar a un grupo de jóvenes de la comunidad.",
    options: [
      {
        id: "aceptar_ensenar",
        label: "Aceptar la propuesta",
        attributeId: "voluntad",
        difficulty: 12,
        successText: "{name} demostró paciencia y disposición como maestro.",
        failureText:
          "{name} se frustró rápido, y la experiencia no salió como esperaba.",
        successEffect: { traitEffect: { type: "add", traitId: "generoso" } },
      },
      {
        id: "declinar_ensenar",
        label: "Declinar cortésmente",
        attributeId: "percepcion",
        difficulty: 9,
        successText: "{name} rechazó la propuesta sin ofender a nadie.",
        failureText: "La negativa de {name} no cayó nada bien.",
      },
    ],
  },
  {
    id: "documento_dificil",
    favors: { education: "ninguna" },
    prompt:
      "{name} necesita entender un documento importante, lleno de términos confusos.",
    options: [
      {
        id: "descifrarlo",
        label: "Intentar descifrarlo por su cuenta",
        attributeId: "intelecto",
        difficulty: 14,
        successText: "{name} logró entender lo esencial del documento.",
        failureText: "{name} malinterpretó una parte importante del documento.",
      },
      {
        id: "pedir_ayuda",
        label: "Pedir ayuda a alguien de confianza",
        attributeId: "percepcion",
        difficulty: 10,
        successText:
          "{name} encontró a alguien dispuesto a explicárselo con claridad.",
        failureText:
          "{name} no encontró a nadie disponible que pudiera ayudarle a tiempo.",
      },
    ],
  },
  {
    id: "peregrinacion",
    requires: { religion: "devoto" },
    prompt:
      "La comunidad de {name} organiza una peregrinación exigente hacia un lugar sagrado.",
    options: [
      {
        id: "completar_peregrinacion",
        label: "Completar la peregrinación",
        attributeId: "resistencia",
        difficulty: 13,
        successText:
          "{name} completó la peregrinación, ganándose el respeto de su comunidad.",
        failureText:
          "{name} no logró terminar el trayecto y tuvo que abandonar a mitad de camino.",
        successEffect: {
          attributeEffect: {
            attributeId: "resistencia",
            amount: 1,
            permanent: true,
          },
        },
      },
      {
        id: "quedarse",
        label: "Quedarse atrás, con la conciencia intranquila",
        attributeId: "voluntad",
        difficulty: 9,
        successText: "{name} hizo las paces consigo mismo por no ir.",
        failureText: "{name} no logró sacudirse la culpa por haberse quedado.",
        failureEffect: { traitEffect: { type: "add", traitId: "desconfiado" } },
      },
    ],
  },
  {
    id: "presion_ritual",
    favors: { religion: "no_creyente" },
    prompt:
      "La comunidad de {name} espera que participe en un ritual religioso en el que no cree.",
    options: [
      {
        id: "fingir",
        label: "Participar fingiendo devoción",
        attributeId: "percepcion",
        difficulty: 11,
        successText: "{name} pasó desapercibido sin levantar sospechas.",
        failureText:
          "Algunos notaron la falta de sinceridad de {name} en el ritual.",
      },
      {
        id: "rechazar_ritual",
        label: "Rechazar participar abiertamente",
        attributeId: "voluntad",
        difficulty: 13,
        successText:
          "{name} se mantuvo firme en sus convicciones, y la comunidad lo respetó.",
        failureText:
          "El rechazo de {name} generó tensión con parte de la comunidad.",
        successEffect: {
          traitEffect: {
            type: "add",
            traitId: "valiente",
            removesTraitId: "cobarde",
          },
        },
        failureEffect: { traitEffect: { type: "add", traitId: "desconfiado" } },
      },
    ],
  },
];

export function getDecisionById(id) {
  return DECISIONS.find((decision) => decision.id === id);
}