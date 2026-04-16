import { useState, useEffect, useMemo } from "react";
import { Plus, X, Search } from "lucide-react";
import { getPokemons } from "@/utils/api.js";

const TEAM_KEY = "pokemon-team";

export default function TeamBuilder() {
  // Load team from localStorage
  const [team, setTeam] = useState(() => {
    try {
      const saved = localStorage.getItem(TEAM_KEY);
      return saved ? JSON.parse(saved) : Array(6).fill(null);
    } catch (err) {
      console.error("Error loading team from localStorage:", err);
      return Array(6).fill(null);
    }
  });

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const data = await getPokemons();
        setPokemons(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching pokemons:", error);
        setPokemons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  // Save team to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(TEAM_KEY, JSON.stringify(team));
    } catch (err) {
      console.error("Error saving team to localStorage:", err);
    }
  }, [team]);

  const filteredPokemons = useMemo(() => {
    return pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [pokemons, search]);

  const addPokemonToSlot = (pokemon, index) => {
    const newTeam = [...team];
    newTeam[index] = pokemon;
    setTeam(newTeam);
    setSelectedSlot(null);
    setSearch("");
  };

  const removePokemonFromSlot = (index, e) => {
    e.stopPropagation();
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Build Your Team</h1>

      {/* Team Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {team.map((slot, index) => (
          <div
            key={index}
            onClick={() => setSelectedSlot(index)}
            className="relative h-48 rounded-2xl border-2 border-muted-foreground bg-background shadow-sm flex items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary"
          >
            {slot ? (
              <>
                <button
                  onClick={(e) => removePokemonFromSlot(index, e)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-muted hover:bg-destructive hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <img
                    src={slot.image}
                    alt={slot.name}
                    className="h-24 mx-auto drop-shadow-md"
                  />
                  <p className="capitalize mt-2 font-medium">{slot.name}</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <Plus className="w-10 h-10 mb-2" />
                <p className="font-medium">Add Pokémon</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Minimal Dynamic Modal */}
      {selectedSlot !== null && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-24 px-4"
          onClick={() => setSelectedSlot(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-3xl border border-white/10 bg-background/95 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Search Header */}
            <div className="sticky top-0 border-b bg-background/90 backdrop-blur-md p-4">
              <div className="flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={`Search Pokémon for slot ${selectedSlot + 1}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent outline-none text-sm"
                />
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="rounded-lg p-1 hover:bg-muted transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[500px] overflow-y-auto p-4">
              {loading ? (
                <p className="text-center text-sm text-muted-foreground py-10">
                  Loading Pokémon...
                </p>
              ) : filteredPokemons.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-10">
                  No Pokémon found
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filteredPokemons.map((pokemon) => (
                    <button
                      key={pokemon.id}
                      onClick={() => addPokemonToSlot(pokemon, selectedSlot)}
                      className="group rounded-2xl border p-3 hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                    >
                      <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="h-16 mx-auto transition-transform duration-200 group-hover:scale-110"
                      />
                      <p className="mt-2 text-xs capitalize text-center font-medium">
                        {pokemon.name}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
