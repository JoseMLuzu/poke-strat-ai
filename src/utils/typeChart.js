// typeChart.js

// Lista de tipos y contra quién son fuertes (2x) y débiles (0.5x)
export const typeChart = {
  fire: { weaknesses: ["water", "ground", "rock"] },
  water: { weaknesses: ["electric", "grass"] },
  grass: { weaknesses: ["fire", "ice", "poison", "flying", "bug"] },
  electric: { weaknesses: ["ground"] },
  ice: { weaknesses: ["fire", "fighting", "rock", "steel"] },
  fighting: { weaknesses: ["flying", "psychic", "fairy"] },
  poison: { weaknesses: ["ground", "psychic"] },
  ground: { weaknesses: ["water", "grass", "ice"] },
  flying: { weaknesses: ["electric", "ice", "rock"] },
  psychic: { weaknesses: ["bug", "ghost", "dark"] },
  bug: { weaknesses: ["fire", "flying", "rock"] },
  rock: { weaknesses: ["water", "grass", "fighting", "ground", "steel"] },
  ghost: { weaknesses: ["ghost", "dark"] },
  dragon: { weaknesses: ["ice", "dragon", "fairy"] },
  dark: { weaknesses: ["fighting", "bug", "fairy"] },
  steel: { weaknesses: ["fire", "fighting", "ground"] },
  fairy: { weaknesses: ["poison", "steel"] },
  normal: { weaknesses: ["fighting"] },
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
