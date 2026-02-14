import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { getPokemons } from "@/utils/api.js";

export default function TeamBuilder() {
  const [team, setTeam] = useState(Array(6).fill(null));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const data = await getPokemons();
        setPokemons(data);
      } catch (error) {
        console.error("Error fetching pokemons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  const addPokemonToSlot = (pokemon, index) => {
    const newTeam = [...team];
    newTeam[index] = pokemon;
    setTeam(newTeam);
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Build Your Team</h1>

      {/* Team Grid */}
      <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
        {team.map((slot, index) => (
          <div
            key={index}
            onClick={() => setSelectedSlot(index)}
            className="h-48 rounded-xl border-2 border-border bg-background flex items-center justify-center cursor-pointer hover:border-primary transition"
          >
            {slot ? (
              <div className="text-center">
                <img
                  src={slot.image}
                  alt={slot.name}
                  className="h-20 mx-auto"
                />
                <p className="capitalize mt-2">{slot.name}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <Plus className="w-8 h-8" />
                <p>Add Pokémon</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selector */}
      {selectedSlot !== null && (
        <div className="mt-10 max-w-5xl mx-auto">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="grid grid-cols-6 gap-4">
              {pokemons.map((pokemon) => (
                <div
                  key={pokemon.id}
                  onClick={() => addPokemonToSlot(pokemon, selectedSlot)}
                  className="cursor-pointer hover:scale-105 transition"
                >
                  <img src={pokemon.image} alt={pokemon.name} />
                  <p className="text-center text-sm capitalize">
                    {pokemon.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
