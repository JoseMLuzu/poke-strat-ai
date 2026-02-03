import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { typeColor } from "../utils/colors";

export default function PokemonCard({ pokemon }) {
  // Obtenemos los colores de los tipos
  const colors = pokemon.types.map((type) => typeColor(type));

  return (
    <Link to={`/pokemon/${pokemon.id}`} className="block">
      <Card className="relative border-2 p-6 w-45 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg hover:border-yellow-500">
        <CardContent className="flex flex-col items-center p-0 w-full relative">
          {/* Difuminado detrás del Pokémon */}
          <div
            className="absolute w-24 h-24 rounded-full blur-xl opacity-30 -z-10"
            style={{
              background: `radial-gradient(circle, ${colors[0]}, ${colors[1] || colors[0]} 70%)`,
            }}
          ></div>

          {/* Imagen del Pokémon */}
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="h-32 w-auto mb-1 object-contain relative z-10"
          />

          {/* Número del Pokémon */}
          <h5 className="font-bold text-gray-400 opacity-60 text-xs">
            #{String(pokemon.number).padStart(3, "0")}
          </h5>

          {/* Nombre del Pokémon */}
          <h2 className="capitalize font-bold text-sm text-center text-amber-50">
            {pokemon.name}
          </h2>

          {/* Contenedor horizontal de tipos */}
          <div className="flex justify-center gap-2 mt-3">
            {pokemon.types.map((type) => (
              <Badge
                key={type}
                className="text-white font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: typeColor(type) }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
