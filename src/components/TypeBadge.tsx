import { PokemonType, typeColors } from "@/lib/pokemon-types";
import { cn } from "@/lib/utils";

export function TypeBadge({
  type,
  size = "md",
}: {
  type: PokemonType;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "rounded-full text-foreground font-bold uppercase tracking-wide",
        typeColors[type],
        size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5",
      )}
    >
      {type}
    </span>
  );
}
