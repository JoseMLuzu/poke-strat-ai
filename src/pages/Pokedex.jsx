import { useEffect, useState } from "react";
import { getPokemons } from "../utils/api";
import PokemonCard from "../components/PokemonCard";
import { typeColor } from "../utils/colors";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

export default function Pokedex() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(30);
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
            className="text-sm border-2 border-border bg-background placeholder:text-muted-foreground hover:border-border"
          />
        </Field>
      </div>

      {/* Types as Badges */}
      <div className="flex justify-center mb-6 overflow-x-auto">
        <div className="flex gap-2 px-4">
          {pokemonTypes.map((type) => {
            const isActive = selectedTypes.includes(type);

            return (
              <Badge
                key={type}
                onClick={() => toggleType(type)}
                className={`cursor-pointer select-none px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all duration-150 text-foreground
                  ${
                    isActive
                      ? "scale-110 shadow-lg ring-2 ring-primary"
                      : "opacity-50 hover:opacity-100"
                  }
                `}
                style={{
                  backgroundColor: typeColor(type),
                }}
              >
                {type}
              </Badge>
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

      <div className="bg-background text-foreground p-10">TOKEN TEST</div>

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
