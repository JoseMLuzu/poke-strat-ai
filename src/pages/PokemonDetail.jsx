import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPokemonDetails } from "../utils/api";
import { typeColor } from "../utils/colors";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
        setError("Pokémon no encontrado");
        console.error(err);
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
        <p className="text-lg font-medium">Cargando Pokémon...</p>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen w-screen p-4 flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-destructive">{error || "Pokémon no encontrado"}</p>
        <Button onClick={() => navigate("/")}>Volver al Pokédex</Button>
      </div>
    );
  }

  const primaryType = pokemon.types[0];
  const statNames = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defensa",
    "special-attack": "Ataque Especial",
    "special-defense": "Defensa Especial",
    speed: "Velocidad",
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
          Volver al Pokédex
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Imagen y tipos */}
          <Card
            className="border-4"
            style={{ borderColor: typeColor(primaryType) }}
          >
            <CardContent className="p-6 flex flex-col items-center">
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

          {/* Información básica */}
          <Card className="border-4" style={{ borderColor: typeColor(primaryType) }}>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Altura</p>
                <p className="text-lg font-semibold">{pokemon.height} m</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Peso</p>
                <p className="text-lg font-semibold">{pokemon.weight} kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Habilidades</p>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability, idx) => (
                    <Badge
                      key={idx}
                      variant={ability.isHidden ? "outline" : "default"}
                      className="capitalize"
                    >
                      {ability.name.replace("-", " ")}
                      {ability.isHidden && " (Oculta)"}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card className="md:col-span-2 border-4" style={{ borderColor: typeColor(primaryType) }}>
            <CardHeader>
              <CardTitle>Estadísticas Base</CardTitle>
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

          {/* Evoluciones */}
          {pokemon.evolutions && pokemon.evolutions.length > 0 && (
            <Card className="md:col-span-2 border-4" style={{ borderColor: typeColor(primaryType) }}>
              <CardHeader>
                <CardTitle>Cadena de Evolución</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-start justify-center gap-6 md:gap-8">
                  {pokemon.evolutions.map((evolution, index) => (
                    <div key={evolution.id} className="flex items-start gap-2 md:gap-4">
                      <div className="flex flex-col items-center max-w-[140px]">
                        <Link
                          to={`/pokemon/${evolution.id}`}
                          className={`flex flex-col items-center transition-transform hover:scale-105 w-full ${
                            evolution.isCurrent ? "ring-4 ring-primary rounded-lg p-2" : ""
                          }`}
                        >
                          <img
                            src={evolution.image}
                            alt={evolution.name}
                            className={`h-24 w-24 object-contain mb-2 ${
                              evolution.isCurrent ? "" : "opacity-70 hover:opacity-100"
                            }`}
                          />
                          <p className="text-sm font-semibold capitalize text-center mb-1">
                            {evolution.name.replace(/-/g, " ")}
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            #{String(evolution.id).padStart(3, "0")}
                          </p>
                        </Link>
                        
                        {evolution.requirements.length > 0 && (
                          <div className="mt-2 text-center w-full">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              Requisitos:
                            </p>
                            <div className="flex flex-col gap-1">
                              {evolution.requirements.map((req, reqIdx) => (
                                <Badge
                                  key={reqIdx}
                                  variant="outline"
                                  className="text-xs px-2 py-0.5 whitespace-normal"
                                >
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {index < pokemon.evolutions.length - 1 && (
                        <div className="flex items-center h-full pt-12">
                          <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {pokemon.evolutions.length === 1 && (
<p className="text-sm text-muted-foreground text-center mt-4">
                  Este Pokémon no tiene evoluciones
                </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Movimientos */}
          <Card className="md:col-span-2 border-4" style={{ borderColor: typeColor(primaryType) }}>
            <CardHeader>
              <CardTitle>Movimientos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {pokemon.moves.map((move, idx) => (
                  <Badge key={idx} variant="outline" className="capitalize">
                    {move.replace("-", " ")}
                  </Badge>
                ))}
              </div>
              {pokemon.moves.length === 10 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Mostrando primeros 10 movimientos
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
