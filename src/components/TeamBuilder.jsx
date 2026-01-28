import { useState } from "react";
import PokemonCard from "./PokemonCard"; // reutilizamos nuestro componente de Pokémon
import { getTypeEffectiveness } from "../utils/typeChart";

export default function TeamBuilder({ pokemons }) {
  // 1️⃣ Estado para guardar los Pokémon que el usuario agrega a su equipo
  const [team, setTeam] = useState([]);

  // 2️⃣ Función para agregar un Pokémon al equipo
  const addToTeam = (pokemon) => {
    // Solo permitimos 6 Pokémon
    if (team.length >= 6) return alert("Your team is full!");
    // Agregamos el Pokémon al estado
    setTeam([...team, pokemon]);
  };

  // 3️⃣ Función para eliminar un Pokémon del equipo
  const removeFromTeam = (id) => {
    setTeam(team.filter((p) => p.id !== id));
  };

  // 4️⃣ Calcular debilidades combinadas del equipo
  const combinedWeaknesses = () => {
    const weaknesses = {};
    team.forEach((p) => {
      const { weaknesses: w } = getTypeEffectiveness(p.types);
      w.forEach((type) => {
        weaknesses[type] = (weaknesses[type] || 0) + 1;
      });
    });
    return weaknesses; // tipo => cantidad de Pokémon vulnerables a ese tipo
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Team Builder</h1>

      {/* 🟢 Lista de Pokémon disponibles para agregar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {pokemons.map((p) => (
          <div key={p.id} onClick={() => addToTeam(p)}>
            <PokemonCard pokemon={p} />
          </div>
        ))}
      </div>

      {/* 🔵 Tu equipo */}
      <h2 className="text-xl font-semibold mb-2">Your Team</h2>
      <div className="flex space-x-4 mb-4">
        {team.map((p) => (
          <div key={p.id} onClick={() => removeFromTeam(p.id)}>
            <PokemonCard pokemon={p} />
          </div>
        ))}
      </div>

      {/* ⚠️ Mostrar debilidades combinadas */}
      <h2 className="text-xl font-semibold">Team Weaknesses</h2>
      <ul>
        {Object.entries(combinedWeaknesses()).map(([type, count]) => (
          <li key={type}>
            {type} ({count})
          </li>
        ))}
      </ul>
    </div>
  );
}
