import { useEffect, useState } from "react";
import { getPokemons } from "../utils/api";
import PokemonCard from "../components/PokemonCard";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export default function Pokedex() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(30);

  useEffect(() => {
    async function fetchData() {
      const data = await getPokemons();
      setPokemons(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredPokemons = pokemons.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(pokemon.number).padStart(3, "0").includes(searchTerm),
  );

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
      <div className="flex justify-center mb-4">
        <div className="flex gap-4 items-center">
          <Field orientation="horizontal" className="w-80">
            <Input
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(30);
              }}
              className="text-sm border-2 hover:border-yellow-700"
              style={{
                color: "#374151",
                backgroundColor: "#ffffff",
                borderColor: "#6b7280",
              }}
            />
          </Field>
        </div>
      </div>
      <div className="flex justify-center items-start mt-4">
        <div className="grid grid-cols-6 max-w-full" style={{ gap: "0.75rem" }}>
          {filteredPokemons.slice(0, visibleCount).map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      </div>
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
