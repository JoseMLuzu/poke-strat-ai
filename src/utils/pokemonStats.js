import { allTypes, typeEffectiveness } from "../lib/pokemon-types";

// Maps stat keys from API to readable names
export const statNames = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Special Attack",
  "special-defense": "Special Defense",
  speed: "Speed",
};

const formatMultiplier = (multiplier) => `${multiplier}x`;

export const getCombinedWeaknesses = (types = []) => {
  if (types.length === 0) return [];

  return allTypes.filter((attackingType) => {
    const multiplier = types.reduce(
      (total, defendingType) =>
        total * (typeEffectiveness[attackingType]?.[defendingType] ?? 1),
      1,
    );

    return multiplier > 1;
  });
};

export const getCombinedStrengths = (types = []) => {
  if (types.length === 0) return [];

  return allTypes.filter((defendingType) =>
    types.some(
      (attackingType) =>
      (typeEffectiveness[attackingType]?.[defendingType] ?? 1) > 1,
    ),
  );
};

export const getCombinedWeaknessDetails = (types = []) => {
  if (types.length === 0) return [];

  return allTypes
    .map((attackingType) => {
      const multiplier = types.reduce(
        (total, defendingType) =>
          total * (typeEffectiveness[attackingType]?.[defendingType] ?? 1),
        1,
      );

      return {
        type: attackingType,
        multiplier,
        label: formatMultiplier(multiplier),
      };
    })
    .filter(({ multiplier }) => multiplier > 1)
    .sort((a, b) => b.multiplier - a.multiplier || a.type.localeCompare(b.type));
};

export const getCombinedStrengthDetails = (types = []) => {
  if (types.length === 0) return [];

  return allTypes
    .map((defendingType) => {
      const multiplier = types.reduce(
        (best, attackingType) =>
          Math.max(best, typeEffectiveness[attackingType]?.[defendingType] ?? 1),
        1,
      );

      return {
        type: defendingType,
        multiplier,
        label: formatMultiplier(multiplier),
      };
    })
    .filter(({ multiplier }) => multiplier > 1)
    .sort((a, b) => b.multiplier - a.multiplier || a.type.localeCompare(b.type));
};
