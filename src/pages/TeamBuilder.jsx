import { useState, useEffect, useMemo } from "react";
import { Plus, X, Search } from "lucide-react";
import { getPokemons } from "@/utils/api.js";

import { TypeBadge } from "@/components/TypeBadge";
import { allTypes, typeEffectiveness } from "@/lib/pokemon-types";

const TEAM_KEY = "pokemon-team";

export default function TeamBuilder() {
  /* ---------------- STATE ---------------- */
  const [team, setTeam] = useState(() => {
    try {
      const saved = localStorage.getItem(TEAM_KEY);
      return saved ? JSON.parse(saved) : Array(6).fill(null);
    } catch {
      return Array(6).fill(null);
    }
  });

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const data = await getPokemons();
        setPokemons(Array.isArray(data) ? data : []);
      } catch {
        setPokemons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  /* ---------------- SAVE ---------------- */
  useEffect(() => {
    localStorage.setItem(TEAM_KEY, JSON.stringify(team));
  }, [team]);

  /* ---------------- HELPERS ---------------- */
  const getPokemonTypes = (pokemon) => {
    if (!pokemon) return [];
    return pokemon.types || (pokemon.type ? [pokemon.type] : []);
  };

  const getRoleWeight = (pokemon) => {
    const s = pokemon?.stats;
    if (!s) return 1;

    const avg = (s.hp + s.defense + s.specialDefense) / 3;

    if (avg >= 80) return 1.5; // tank
    if (avg >= 60) return 1.2; // bulky
    return 1; // glass cannon
  };

  /* ---------------- FILTER ---------------- */
  const filteredPokemons = useMemo(() => {
    return pokemons.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [pokemons, search]);

  /* ---------------- WEAKNESS MAPS ---------------- */
  const { threatScore, teamWeaknessMap, teamResistanceMap, topWeakPoints } =
    useMemo(() => {
      const weakness = {};
      const resist = {};
      const immune = {};
      const map = {};

      allTypes.forEach((t) => {
        weakness[t] = 0;
        resist[t] = 0;
        immune[t] = 0;
        map[t] = 0;
      });

      team.forEach((pokemon) => {
        if (!pokemon) return;

        const weight = getRoleWeight(pokemon);
        const types = getPokemonTypes(pokemon);

        allTypes.forEach((atkType) => {
          // 👈 tipo que ataca
          let multiplier = 1;

          types.forEach((defType) => {
            // 👈 tipos de tu Pokémon
            multiplier *= typeEffectiveness[atkType][defType];
          });

          if (multiplier === 0) {
            immune[atkType] += weight;
          } else if (multiplier > 1) {
            weakness[atkType] += weight * multiplier;
            map[atkType] += weight * multiplier;
          } else if (multiplier < 1) {
            resist[atkType] += weight * (1 - multiplier);
          }
        });
      });

      let score = 0;

      allTypes.forEach((t) => {
        const w = weakness[t];
        const r = resist[t];
        const i = immune[t];

        score += w * 2;
        score += Math.max(0, w - 1) * 1.5;
        score -= r * 1;
        score -= i * 2;
      });

      const top = Object.entries(map)
        .filter(([, v]) => v > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      return {
        threatScore: Math.round(score),
        teamWeaknessMap: weakness,
        teamResistanceMap: resist,
        topWeakPoints: top,
      };
    }, [team]);

  /* ---------------- ACTIONS ---------------- */
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

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background via-background to-muted/10">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-center mb-10 tracking-tight">
        Pokémon Team Builder
      </h1>

      {/* TEAM GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {team.map((slot, index) => (
          <div
            key={index}
            onClick={() => setSelectedSlot(index)}
            className="
              relative h-52
              rounded-3xl
              border border-border/40
              bg-card/60 backdrop-blur-xl
              shadow-md
              flex items-center justify-center
              cursor-pointer
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl hover:border-primary/40
              active:scale-[0.98]
            "
          >
            {slot ? (
              <>
                <button
                  onClick={(e) => removePokemonFromSlot(index, e)}
                  className="
                    absolute top-3 right-3
                    p-1.5 rounded-full
                    bg-background/60
                    border border-border/30
                    hover:bg-red-500 hover:text-white
                    transition
                  "
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <img
                    src={slot.image}
                    className="h-24 mx-auto drop-shadow-lg hover:scale-110 transition"
                  />
                  <p className="capitalize mt-2 text-sm font-medium">
                    {slot.name}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-muted-foreground flex flex-col items-center">
                <Plus className="w-8 h-8 mb-1" />
                <p>Add Pokémon</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ANALYTICS */}
      <div
        className="
        max-w-4xl mx-auto mt-12 p-6
        rounded-3xl
        border border-border/40
        bg-card/70 backdrop-blur-xl
        shadow-xl
      "
      >
        <h2 className="text-xl font-semibold mb-6">Team Analytics</h2>

        {/* SCORE */}
        <div
          className="
          mb-8 p-4
          rounded-2xl
          bg-muted/20
          border border-border/30
        "
        >
          <p className="text-sm text-muted-foreground">Weakness Score</p>
          <p className="text-3xl font-bold">{threatScore}</p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* WEAKNESSES */}
          <div>
            <h3 className="text-sm font-semibold text-red-400 mb-3">
              Weaknesses
            </h3>

            <div className="flex flex-wrap gap-2">
              {allTypes
                .filter((t) => teamWeaknessMap[t] > 0)
                .sort((a, b) => teamWeaknessMap[b] - teamWeaknessMap[a])
                .map((t) => (
                  <div key={t} className="chip">
                    <TypeBadge type={t} size="sm" />
                    <span className="text-xs">{teamWeaknessMap[t]}x</span>
                  </div>
                ))}
            </div>
          </div>

          {/* RESISTANCES */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-3">
              Resistances
            </h3>

            <div className="flex flex-wrap gap-2">
              {allTypes
                .filter((t) => teamResistanceMap[t] > 0)
                .sort((a, b) => teamResistanceMap[b] - teamResistanceMap[a])
                .map((t) => (
                  <div key={t} className="chip">
                    <TypeBadge type={t} size="sm" />
                    <span className="text-xs">{teamResistanceMap[t]}x</span>
                  </div>
                ))}
            </div>
          </div>

          {/* TOP THREATS */}
          <div>
            <h3 className="text-sm font-semibold text-yellow-400 mb-3">
              Top Threats
            </h3>

            <div className="space-y-2">
              {topWeakPoints.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No major threats
                </p>
              ) : (
                topWeakPoints.map(([type, value]) => (
                  <div
                    key={type}
                    className="
                      flex items-center justify-between
                      p-2 rounded-xl
                      border border-border/30
                      bg-background/30
                    "
                  >
                    <div className="flex items-center gap-2">
                      <TypeBadge type={type} size="sm" />
                      <span className="text-xs">{type}</span>
                    </div>
                    <span className="text-xs font-bold">
                      {Math.round(value)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
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

      {/* CHIP STYLE */}
      <style>{`
        .chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
        }
      `}</style>
    </div>
  );
}
