import { useEffect, useState } from "react";
import { getPokemons } from "../utils/api";
import PokemonCard from "../components/PokemonCard";
import { typeColor } from "../utils/colors.js"; // 👈 usa tu mapa de colores

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export default function Pokedex() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(30);

  // 👇 ahora es array
  const [selectedTypes, setSelectedTypes] = useState([]);

  const pokemonTypes = [
    "normal",
    "fire",
    "water",
    "grass",
    "electric",
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

  useEffect(() => {
    async function fetchData() {
      const data = await getPokemons();
      setPokemons(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const toggleType = (type) => {
    setVisibleCount(30);

    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch =
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(pokemon.number).padStart(3, "0").includes(searchTerm);

    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.some((type) => pokemon.types.includes(type));

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center text-center gap-4 bg-background">
        <Spinner />
        <p className="text-lg font-medium">Loading Pokémon...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Pokédex</h1>

      {/* Search */}
      <div className="flex justify-center mb-4">
        <Field orientation="horizontal" className="w-80">
          <Input
            type="search"
            placeholder="Search by name or number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(30);
            }}
            className="text-sm border-2 hover:border-yellow-700 bg-black placeholder:text-gray-500"
            style={{
              color: "#374151",
              borderColor: "#6b7280",
            }}
          />
        </Field>
      </div>

      {/* Types horizontal chips */}
      <div className="flex justify-center mb-6 overflow-x-auto">
        <div className="flex gap-2 px-4">
          {pokemonTypes.map((type) => {
            const isActive = selectedTypes.includes(type);

            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-transform duration-150
                  ${isActive ? "scale-110 shadow-lg" : "opacity-60 hover:opacity-100"}
                `}
                style={{
                  backgroundColor: typeColor[type],
                  color: "#fff",
                  border: isActive ? "2px solid white" : "none",
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="flex justify-center items-start mt-4">
        <div className="grid grid-cols-6 max-w-full" style={{ gap: "0.75rem" }}>
          {filteredPokemons.slice(0, visibleCount).map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      </div>

      {/* Load More */}
      {visibleCount < filteredPokemons.length && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => setVisibleCount((prev) => prev + 30)}
            className="px-6 py-2"
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
