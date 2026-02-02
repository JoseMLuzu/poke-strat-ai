import { useState } from "react";
import PokemonCard from "./PokemonCard";
import { typeColor } from "../utils/colors";
import { typeChart } from "../utils/typeChart"; // aquí pondrás la lógica de debilidades por tipo

export default function TeamBuilder({ pokemons }) {
  const [team, setTeam] = useState([]);

  // Agregar o quitar Pokémon del equipo
  const togglePokemon = (pokemon) => {
    if (team.find((p) => p.id === pokemon.id)) {
      setTeam(team.filter((p) => p.id !== pokemon.id));
    } else if (team.length < 6) {
      setTeam([...team, pokemon]);
    }
  };

  // Calcular debilidades combinadas
  const combinedWeaknesses = () => {
    const weaknesses = {};
    team.forEach((p) => {
      p.types.forEach((t) => {
        const weakTo = typeChart[t]?.weaknesses || [];
        weakTo.forEach((w) => {
          weaknesses[w] = (weaknesses[w] || 0) + 1;
        });
      });
    });
    return weaknesses;
  };

  const weaknesses = combinedWeaknesses();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Team Builder</h1>

      {/* Lista de todos los Pokémon */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {pokemons.map((p) => (
          <div
            key={p.id}
            onClick={() => togglePokemon(p)}
            className="cursor-pointer"
          >
            <PokemonCard pokemon={p} />
          </div>
        ))}
      </div>

      {/* Equipo seleccionado */}
      <h2 className="text-xl font-semibold mb-2">
        Your Team ({team.length}/6)
      </h2>
      <div className="flex gap-4 mb-4">
        {team.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>

      {/* Debilidades combinadas */}
      <h2 className="text-xl font-semibold mb-2">Team Weaknesses</h2>
      <div className="flex flex-wrap gap-2">
        {Object.entries(weaknesses).map(([type, count]) => (
          <span
            key={type}
            className="px-2 py-1 rounded text-white text-sm"
            style={{ backgroundColor: typeColor(type) }}
            title={`${count} Pokémon vulnerable`}
          >
            {type} ({count})
          </span>
        ))}
      </div>
    </div>
  );
}
