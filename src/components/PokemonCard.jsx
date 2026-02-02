import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { typeColor } from "../utils/colors";

export default function PokemonCard({ pokemon }) {
  const primaryType = pokemon.types[0];

  return (
    <Card
      className="border-4 p-6 w-45"
      style={{ borderColor: typeColor(primaryType) }}
    >
      <CardContent className="flex flex-col items-center p-0 w-full">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="h-32 w-auto mb-1 object-contain image-rendering-auto"
        />

        <h5 className="font-bold text-gray-400 opacity-60 text-xs">
          #{String(pokemon.number).padStart(3, "0")}
        </h5>

        <h2 className="capitalize font-bold text-sm text-center">
          {pokemon.name}
        </h2>

        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {pokemon.types.map((type) => (
            <Badge
              key={type}
              className="text-white font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: typeColor(type) }}
            >
              {type}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
