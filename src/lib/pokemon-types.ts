export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export const allTypes: PokemonType[] = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export const typeColors: Record<PokemonType, string> = {
  normal: "bg-zinc-500",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-400",
  fighting: "bg-red-700",
  poison: "bg-purple-600",
  ground: "bg-amber-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-600",
  rock: "bg-stone-600",
  ghost: "bg-violet-700",
  dragon: "bg-indigo-700",
  dark: "bg-neutral-800",
  steel: "bg-slate-400",
  fairy: "bg-pink-300",
};


export const typeAbbrev: Record<PokemonType, string> = {
  normal: "NOR",
  fire: "FIR",
  water: "WAT",
  electric: "ELE",
  grass: "GRA",
  ice: "ICE",
  fighting: "FIG",
  poison: "POI",
  ground: "GRO",
  flying: "FLY",
  psychic: "PSY",
  bug: "BUG",
  rock: "ROC",
  ghost: "GHO",
  dragon: "DRA",
  dark: "DAR",
  steel: "STE",
  fairy: "FAI",
};

export const typeEffectiveness: Record<
  PokemonType,
  Record<PokemonType, number>
> = Object.fromEntries(
  allTypes.map((a) => [a, Object.fromEntries(allTypes.map((d) => [d, 1]))]),
) as Record<PokemonType, Record<PokemonType, number>>;

// helper
const set = (a: PokemonType, d: PokemonType, v: number) =>
  (typeEffectiveness[a][d] = v);

// EFECTIVIDADES REALES
set("normal", "rock", 0.5);
set("normal", "ghost", 0);
set("normal", "steel", 0.5);

set("fire", "fire", 0.5);
set("fire", "water", 0.5);
set("fire", "grass", 2);
set("fire", "ice", 2);
set("fire", "bug", 2);
set("fire", "rock", 0.5);
set("fire", "dragon", 0.5);
set("fire", "steel", 2);

set("water", "fire", 2);
set("water", "water", 0.5);
set("water", "grass", 0.5);
set("water", "ground", 2);
set("water", "rock", 2);
set("water", "dragon", 0.5);

set("electric", "water", 2);
set("electric", "electric", 0.5);
set("electric", "grass", 0.5);
set("electric", "ground", 0);
set("electric", "flying", 2);
set("electric", "dragon", 0.5);

set("grass", "fire", 0.5);
set("grass", "water", 2);
set("grass", "grass", 0.5);
set("grass", "poison", 0.5);
set("grass", "ground", 2);
set("grass", "flying", 0.5);
set("grass", "bug", 0.5);
set("grass", "rock", 2);
set("grass", "dragon", 0.5);
set("grass", "steel", 0.5);

set("ice", "fire", 0.5);
set("ice", "water", 0.5);
set("ice", "grass", 2);
set("ice", "ground", 2);
set("ice", "flying", 2);
set("ice", "dragon", 2);
set("ice", "steel", 0.5);

set("fighting", "normal", 2);
set("fighting", "ice", 2);
set("fighting", "rock", 2);
set("fighting", "dark", 2);
set("fighting", "steel", 2);
set("fighting", "poison", 0.5);
set("fighting", "flying", 0.5);
set("fighting", "psychic", 0.5);
set("fighting", "bug", 0.5);
set("fighting", "ghost", 0);
set("fighting", "fairy", 0.5);

set("poison", "grass", 2);
set("poison", "fairy", 2);
set("poison", "poison", 0.5);
set("poison", "ground", 0.5);
set("poison", "rock", 0.5);
set("poison", "ghost", 0.5);
set("poison", "steel", 0);

set("ground", "fire", 2);
set("ground", "electric", 2);
set("ground", "grass", 0.5);
set("ground", "poison", 2);
set("ground", "flying", 0);
set("ground", "bug", 0.5);
set("ground", "rock", 2);
set("ground", "steel", 2);

set("flying", "grass", 2);
set("flying", "fighting", 2);
set("flying", "bug", 2);
set("flying", "electric", 0.5);
set("flying", "rock", 0.5);
set("flying", "steel", 0.5);

set("psychic", "fighting", 2);
set("psychic", "poison", 2);
set("psychic", "psychic", 0.5);
set("psychic", "dark", 0);
set("psychic", "steel", 0.5);

set("bug", "grass", 2);
set("bug", "psychic", 2);
set("bug", "dark", 2);
set("bug", "fire", 0.5);
set("bug", "fighting", 0.5);
set("bug", "poison", 0.5);
set("bug", "flying", 0.5);
set("bug", "ghost", 0.5);
set("bug", "steel", 0.5);
set("bug", "fairy", 0.5);

set("rock", "fire", 2);
set("rock", "ice", 2);
set("rock", "flying", 2);
set("rock", "bug", 2);
set("rock", "fighting", 0.5);
set("rock", "ground", 0.5);
set("rock", "steel", 0.5);

set("ghost", "psychic", 2);
set("ghost", "ghost", 2);
set("ghost", "dark", 0.5);
set("ghost", "normal", 0);

set("dragon", "dragon", 2);
set("dragon", "steel", 0.5);
set("dragon", "fairy", 0);

set("dark", "psychic", 2);
set("dark", "ghost", 2);
set("dark", "fighting", 0.5);
set("dark", "dark", 0.5);
set("dark", "fairy", 0.5);

set("steel", "ice", 2);
set("steel", "rock", 2);
set("steel", "fairy", 2);
set("steel", "fire", 0.5);
set("steel", "water", 0.5);
set("steel", "electric", 0.5);
set("steel", "steel", 0.5);

set("fairy", "fighting", 2);
set("fairy", "dragon", 2);
set("fairy", "dark", 2);
set("fairy", "fire", 0.5);
set("fairy", "poison", 0.5);
set("fairy", "steel", 0.5);
