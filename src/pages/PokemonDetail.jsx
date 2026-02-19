// React and routing libraries
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// Third-party libraries (icons)
import { ArrowLeft, ArrowRight } from "lucide-react";

// Utils / helper functions
import { getPokemonDetails } from "../utils/api";
import { typeColor } from "../utils/colors";
import { typeChart } from "../utils/typeChart";
import { statNames, getCombinedWeaknesses } from "../utils/pokemonStats";
import {
  getRequirementIcon,
  formatRequirement,
} from "../utils/requirementIcon";

// UI components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const data = await getPokemonDetails(id);
        setPokemon(data);
        setError(null);
      } catch {
        setError("Pokémon not found");
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-center">
        <Spinner />
        <p className="text-lg font-medium">Loading Pokémon...</p>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background text-center px-4">
        <p className="text-xl font-bold text-destructive">
          {error || "Pokémon not found"}
        </p>
        <Button onClick={() => navigate("/")}>Back to Pokédex</Button>
      </div>
    );
  }

  const primaryType = pokemon.types[0];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background py-10 px-4">
        <div className="container mx-auto max-w-5xl space-y-8">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pokédex
          </Button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image + Types */}
            <Card className="border border-border shadow-md bg-card">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="h-64 w-auto object-contain mb-4"
                />

                <span className="text-sm text-muted-foreground">
                  #{String(pokemon.number).padStart(3, "0")}
                </span>

                <h1 className="text-3xl font-bold capitalize mt-2 mb-4">
                  {pokemon.name}
                </h1>

                <div className="flex flex-wrap justify-center gap-2">
                  {pokemon.types.map((type) => (
                    <Badge
                      key={type}
                      className="px-4 py-2 rounded-full font-semibold text-foreground uppercase"
                      style={{ backgroundColor: typeColor(type) }}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="border border-border shadow-md bg-card p-5">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div>
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="text-lg font-semibold">{pokemon.height} m</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="text-lg font-semibold">{pokemon.weight} kg</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-md font-semibold">{pokemon.description}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Abilities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map((ability) => (
                      <Tooltip key={ability.name}>
                        <TooltipTrigger asChild>
                          <Badge
                            variant={ability.isHidden ? "outline" : "default"}
                            className="cursor-help capitalize"
                          >
                            {ability.name.replace(/-/g, " ")}
                            {ability.isHidden && " (Hidden)"}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-sm">
                          {ability.description}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Type Weaknesses */}
            <Card className="md:col-span-2 border border-border shadow-md bg-card p-5">
              <CardHeader>
                <CardTitle>Type Weaknesses</CardTitle>
              </CardHeader>

              <CardContent>
                {pokemon?.types?.length > 0 && (
                  <>
                    {/* Pokemon Types */}
                    <div className="flex flex-wrap gap-2">
                      {pokemon.types.map((type) => (
                        <Badge
                          key={type}
                          className="px-4 py-2 rounded-full font-semibold uppercase"
                          style={{
                            backgroundColor: typeColor(type),
                            color:
                              type === "electric" || type === "ice"
                                ? "#000"
                                : "#fff",
                          }}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>

                    {/* Combined Weaknesses */}
                    <div className="mt-6">
                      <p className="text-sm text-muted-foreground mb-2">
                        Weak against:
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {getCombinedWeaknesses(pokemon.types).map((weak) => (
                          <Badge
                            key={weak}
                            className="px-3 py-1 rounded-full font-medium"
                            style={{
                              backgroundColor: typeColor(weak),
                              color:
                                weak === "electric" ||
                                weak === "ice" ||
                                weak === "fairy"
                                  ? "#000"
                                  : "#fff",
                            }}
                          >
                            {weak}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Base Stats */}
            <Card className="md:col-span-2 border border-border shadow-md bg-card p-5">
              <CardHeader>
                <CardTitle>Base Stats</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {pokemon.stats.map((stat) => (
                  <div key={stat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {statNames[stat.name] || stat.name}
                      </span>
                      <span className="text-sm font-bold">{stat.value}</span>
                    </div>

                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full transition-all"
                        style={{
                          width: `${Math.min((stat.value / 255) * 100, 100)}%`,
                          backgroundColor: typeColor(primaryType),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Evolution Chain */}
            {pokemon.evolutions && pokemon.evolutions.length > 0 && (
              <Card className="md:col-span-2 border border-border shadow-md bg-card p-5">
                <CardHeader>
                  <CardTitle>Evolution Chain</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap justify-center items-center gap-8">
                    {pokemon.evolutions.map((evolution, index) => (
                      <div
                        key={evolution.id}
                        className="flex items-center gap-4"
                      >
                        <Link
                          to={`/pokemon/${evolution.id}`}
                          className={`flex flex-col items-center transition-transform hover:scale-105 ${
                            evolution.isCurrent
                              ? "ring-2 ring-primary rounded-lg p-3"
                              : ""
                          }`}
                        >
                          <img
                            src={evolution.image}
                            alt={evolution.name}
                            className="h-24 w-24 object-contain mb-2"
                          />

                          <p className="text-sm font-semibold capitalize">
                            {evolution.name.replace(/-/g, " ")}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            #{String(evolution.id).padStart(3, "0")}
                          </p>

                          {evolution.requirements.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 mt-2">
                              {evolution.requirements.map((req, i) => (
                                <span
                                  key={i}
                                  className="flex items-center px-3 py-1 text-xs font-medium bg-muted/70 border border-border rounded-full"
                                >
                                  {getRequirementIcon(req.type)}
                                  {formatRequirement(req)}
                                </span>
                              ))}
                            </div>
                          )}
                        </Link>

                        {index < pokemon.evolutions.length - 1 && (
                          <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>

                  {pokemon.evolutions.length === 1 && (
                    <p className="text-center text-sm text-muted-foreground mt-6">
                      This Pokémon has no evolutions.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Moves */}
            <Card className="md:col-span-2 border border-border shadow-md bg-card p-5">
              <CardHeader>
                <CardTitle>Moves</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {pokemon.moves.map((move) => (
                    <Tooltip key={move.name}>
                      <TooltipTrigger asChild>
                        <Badge
                          className="cursor-help capitalize px-3 py-1 font-medium text-white hover:scale-105 transition"
                          style={{
                            backgroundColor: typeColor(move.type),
                            color: move.type === "electric" ? "#000" : "#fff",
                          }}
                        >
                          {move.name.replace(/-/g, " ")}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-sm">
                        {move.description}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                {pokemon.moves.length === 10 && (
                  <p className="text-sm text-muted-foreground mt-3">
                    Showing the first 10 moves.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
