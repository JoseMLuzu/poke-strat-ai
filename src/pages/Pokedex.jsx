import { useEffect, useState } from "react";
import { getPokemons } from "../utils/api";
import PokemonCard from "../components/PokemonCard";
import TeamBuilder from "../components/TeamBuilder"; // ✅ importamos nuestro TeamBuilder

export default function Pokedex() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getPokemons();
      setPokemons(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <p className="p-4 text-lg">Loading Pokémon...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pokédex</h1>

      {/* TeamBuilder recibe todos los Pokémon para poder agregarlos */}
      <TeamBuilder pokemons={pokemons} />
    </div>
  );
}
