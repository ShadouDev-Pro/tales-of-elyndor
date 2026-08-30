export { ATTRIBUTES, ATTRIBUTE_IDS, getAttributeById } from "./attributes.js";
export { RACES, PLAYABLE_RACES, getRaceById } from "./races.js";

export { 
    createCharacter, 
    generateAttributes, 
    generatePersonality,
    yearsToDays,
    daysToYears 
} from "./character.js";

export {
    PERSONALITY_DIMENSIONS,
    PERSONALITY_DIMENSION_IDS,
    getPersonalityDimensionById,
} from "./personality.js";

export { TRAITS, getTraitById, applyTraitEffect } from "./traits.js";
export { rollForNewTrait } from "./traits-engine.js";
export { EVENTS, getEventById } from "./events.js";
export { rollForEvent } from "./events-engine.js";

export {
  growAttributes,
  applyAttributeEffect,
  pruneExpiredModifiers,
  getEffectiveAttributeValue,
} from "./attributes-engine.js";