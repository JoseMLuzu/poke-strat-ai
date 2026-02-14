import { useEffect, useState } from "react";
import { getPokemons } from "../utils/api";
import PokemonCard from "../components/PokemonCard";
import { typeColor } from "../utils/colors";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

import { Filter, Search } from "lucide-react";

export default function Pokedex() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(30);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showFilterTypes, setShowFilterTypes] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(0);

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

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch =
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(pokemon.number).padStart(3, "0").includes(searchTerm);

    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.some((type) => pokemon.types.includes(type));

    return matchesSearch && matchesType;
  });

  useEffect(() => {
    setDisplayedCount(Math.min(visibleCount, filteredPokemons.length));
  }, [pokemons, searchTerm, selectedTypes, visibleCount]);

  const toggleType = (type) => {
    setVisibleCount(30);
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-background">
        <Spinner />
        <p className="text-lg font-medium">Loading Pokémon...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Pokédex</h1>

        {/* Search + Filter */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3 w-full max-w-lg">
            {/* Input */}
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search by name or number..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(30);
                }}
                className="text-sm h-12 pl-10 pr-4 border-2 border-border bg-background w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>

            {/* Filter Button */}
            <Button
              onClick={() => setShowFilterTypes((prev) => !prev)}
              className="flex items-center justify-center bg-background text-muted-foreground border-2 border-border hover:!bg-primary hover:!text-primary-foreground transition-colors"
            >
              <Filter className="w-4 h-4" />
            </Button>

            {/* Clear Button */}
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedTypes([]);
                setVisibleCount(30);
              }}
              className="flex items-center justify-center bg-background text-muted-foreground border-2 border-border hover:!bg-red-500 hover:!text-white transition-colors"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Types */}
        {showFilterTypes && (
          <div className="flex justify-center mb-6 overflow-x-auto">
            <div className="flex gap-2 px-2">
              {pokemonTypes.map((type) => {
                const isActive = selectedTypes.includes(type);
                return (
                  <Badge
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`cursor-pointer select-none px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all duration-150 ${
                      isActive
                        ? "scale-110 shadow-lg"
                        : "opacity-50 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: typeColor(type) }}
                  >
                    {type}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Counter */}
        <div className="text-center mb-6 text-sm text-muted-foreground">
          Showing {displayedCount} of {filteredPokemons.length} Pokémon
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredPokemons.slice(0, visibleCount).map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>

        {/* Load More */}
        {visibleCount < filteredPokemons.length && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setVisibleCount((prev) => prev + 30)}
              className="px-6 py-2 bg-background text-muted-foreground border-2 border-border hover:!bg-primary hover:!text-primary-foreground transition-colors"
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
