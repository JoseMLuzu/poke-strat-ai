export default function PokemonCard({ pokemon }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
      <img src={pokemon.image} alt={pokemon.name} className="w-20 h-20 mb-2" />
      <h2 className="capitalize font-bold">{pokemon.name}</h2>
      <div className="flex space-x-2 mt-2">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className="px-2 py-1 rounded text-white text-sm"
            style={{ backgroundColor: typeColor(type) }}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}

// Función simple para colorear tipos
function typeColor(type) {
  const colors = {
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
    normal: "#A8A878",
  };
  return colors[type] || "#68A090";
}
