// typeChart.js

// Lista de tipos y contra quién son fuertes (2x) y débiles (0.5x)
export const typeChart = {
  normal: { weak: ["fighting"], strong: [] },
  fire: {
    weak: ["water", "ground", "rock"],
    strong: ["grass", "ice", "bug", "steel"],
  },
  water: { weak: ["electric", "grass"], strong: ["fire", "ground", "rock"] },
  grass: {
    weak: ["fire", "ice", "poison", "flying", "bug"],
    strong: ["water", "ground", "rock"],
  },
  electric: { weak: ["ground"], strong: ["water", "flying"] },
  ice: {
    weak: ["fire", "fighting", "rock", "steel"],
    strong: ["grass", "ground", "flying", "dragon"],
  },
  fighting: {
    weak: ["flying", "psychic", "fairy"],
    strong: ["normal", "ice", "rock", "dark", "steel"],
  },
  poison: { weak: ["ground", "psychic"], strong: ["grass", "fairy"] },
  ground: {
    weak: ["water", "grass", "ice"],
    strong: ["fire", "electric", "poison", "rock", "steel"],
  },
  flying: {
    weak: ["electric", "ice", "rock"],
    strong: ["grass", "fighting", "bug"],
  },
  psychic: { weak: ["bug", "ghost", "dark"], strong: ["fighting", "poison"] },
  bug: {
    weak: ["fire", "flying", "rock"],
    strong: ["grass", "psychic", "dark"],
  },
  rock: {
    weak: ["water", "grass", "fighting", "ground", "steel"],
    strong: ["fire", "ice", "flying", "bug"],
  },
  ghost: { weak: ["ghost", "dark"], strong: ["psychic", "ghost"] },
  dragon: { weak: ["ice", "dragon", "fairy"], strong: ["dragon"] },
  dark: { weak: ["fighting", "bug", "fairy"], strong: ["psychic", "ghost"] },
  steel: {
    weak: ["fire", "fighting", "ground"],
    strong: ["ice", "rock", "fairy"],
  },
  fairy: { weak: ["poison", "steel"], strong: ["fighting", "dragon", "dark"] },
};

// Dado un Pokémon con 1 o 2 tipos, devuelve debilidades y resistencias
export function getTypeEffectiveness(types) {
  const weaknesses = new Set();
  const strengths = new Set();

  types.forEach((t) => {
    if (!typeChart[t]) return;
    typeChart[t].weak.forEach((w) => weaknesses.add(w));
    typeChart[t].strong.forEach((s) => strengths.add(s));
  });

  // Quitar tipos que son fuertes del listado de debilidades
  strengths.forEach((s) => weaknesses.delete(s));

  return {
    weaknesses: Array.from(weaknesses),
    strengths: Array.from(strengths),
  };
}
