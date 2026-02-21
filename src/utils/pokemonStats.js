import { typeChart } from "./typeChart";

// Maps stat keys from API to readable names
export const statNames = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Special Attack",
  "special-defense": "Special Defense",
  speed: "Speed",
};

export const getCombinedWeaknesses = (types) => {
  if (!types || types.length === 0) return [];

  const weaknessesMap = {};

  types.forEach((type) => {
    const weaknesses = typeChart[type]?.weaknesses || [];

    weaknesses.forEach((weak) => {
      weaknessesMap[weak] = (weaknessesMap[weak] || 0) + 1;
    });
  });

  return Object.keys(weaknessesMap);
};
