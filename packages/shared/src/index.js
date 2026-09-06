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

export { attributeToModifier, rollCheck } from "./rolls.js";
export { SKILLS, getSkillById, getLeafSkills, getSkillPath } from "./skills.js";
export { practiceSkill, isValidLeafSkill } from "./skills-engine.js";
export { checkDeathByOldAge, DEATH_CAUSE_OLD_AGE } from "./mortality.js";
export { DECISIONS, getDecisionById } from "./decisions.js";
export { rollForDecision } from "./decisions-engine.js";