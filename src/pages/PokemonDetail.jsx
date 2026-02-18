import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPokemonDetails } from "../utils/api";
import { typeColor } from "../utils/colors";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Heart,
  Sparkles,
  Gem,
  Repeat,
  Clock,
  User,
  Sword,
  MapPin,
} from "lucide-react";

const getRequirementIcon = (type) => {
  switch (type) {
    case "level":
      return <ArrowUp className="w-3 h-3 mr-1" />;
    case "friendship":
      return <Heart className="w-3 h-3 mr-1" />;
    case "affection":
      return <Sparkles className="w-3 h-3 mr-1" />;
    case "beauty":
      return <Gem className="w-3 h-3 mr-1" />;
    case "trade":
      return <Repeat className="w-3 h-3 mr-1" />;
    case "time":
      return <Clock className="w-3 h-3 mr-1" />;
    case "gender":
      return <User className="w-3 h-3 mr-1" />;
    case "move":
    case "move-type":
      return <Sword className="w-3 h-3 mr-1" />;
    case "location":
      return <MapPin className="w-3 h-3 mr-1" />;
    default:
      return null;
  }
};

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
      } catch (err) {
        setError("Pokémon not found");
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center text-center gap-4 bg-background">
        <Spinner />
        <p className="text-lg font-medium">Loading Pokémon...</p>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen w-screen p-4 flex flex-col items-center justify-center gap-4">
          {error || "Pokémon not found"}
        </p>
        <Button onClick={() => navigate("/")}>Back to Pokédex</Button>
      </div>
    );
  }

  const primaryType = pokemon.types[0];
  const statNames = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Special Attack",
    "special-defense": "Special Defense",
    speed: "Speed",
  };

  const formatRequirement = (req) => {
    switch (req.type) {
      case "level":
        return `Level ${req.value}`;
      case "friendship":
        return "High Friendship";
      case "affection":
        return "High Affection";
      case "beauty":
        return "High Beauty";
      case "item":
        return `Use ${req.value}`;
      case "held-item":
        return `Holding ${req.value}`;
      case "trade":
        return "Trade";
      case "time":
        return req.value === "night" ? "Nighttime" : "Daytime";
      case "gender":
        return req.value === "female" ? "Female Only" : "Male Only";
      case "move":
        return `Knows ${req.value}`;
      case "move-type":
        return `Knows ${req.value}-type move`;
      case "location":
        return `At ${req.value}`;
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen w-screen p-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pokédex
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="border-4"
            style={{ borderColor: typeColor(primaryType) }}
          >
            <CardContent className="p-6 flex flex-col items-center">
          {/* Image + Types */}
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="h-64 w-auto mb-4 object-contain"
              />
              <h5 className="font-bold text-muted-foreground opacity-60 text-sm mb-2">
                #{String(pokemon.number).padStart(3, "0")}
              </h5>
              <h1 className="text-3xl font-bold capitalize mb-4">
                {pokemon.name}
              </h1>
              <div className="flex flex-wrap justify-center gap-2">
                {pokemon.types.map((type) => (
                  <Badge
                    key={type}
                    className="text-foreground font-semibold px-4 py-2 rounded-full text-sm"
                    style={{ backgroundColor: typeColor(type) }}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-4" style={{ borderColor: typeColor(primaryType) }}>
          {/* Basic Info */}
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="text-lg font-semibold">{pokemon.height} m</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="text-lg font-semibold">{pokemon.weight} kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Abilities</p>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability, idx) => (
                    <Badge
                      key={idx}
                      variant={ability.isHidden ? "outline" : "default"}
                      className="capitalize"
                    >
                      {ability.name.replace("-", " ")}
                      {ability.isHidden && " (Hidden)"}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-4" style={{ borderColor: typeColor(primaryType) }}>
          {/* Base Stats */}
            <CardHeader>
              <CardTitle>Base Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pokemon.stats.map((stat) => (
                  <div key={stat.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium capitalize">
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
              </div>
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
                    <div key={evolution.id} className="flex items-center gap-4">
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
                                className="flex items-center px-3 py-1 text-xs font-medium bg-muted/70 border border-border rounded-full backdrop-blur-sm"
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
                  <Badge
                    key={move.name}
                    className="capitalize font-medium px-3 py-1 text-white transition-transform duration-200 hover:scale-105"
                    style={{
                      backgroundColor: typeColor(move.type),
                      color: move.type === "electric" ? "#000" : "#fff",
                    }}
                  >
                    {move.name.replace("-", " ")}
                  </Badge>
                ))}
              </div>

              {pokemon.moves.length === 10 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Showing the first 10 moves.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
