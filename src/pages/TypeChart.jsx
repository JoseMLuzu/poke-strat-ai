import { useState } from "react";
import { TypeBadge } from "@/components/TypeBadge";
import {
  allTypes,
  typeEffectiveness,
  typeColors,
  typeAbbrev,
} from "@/lib/pokemon-types";
import { cn } from "@/lib/utils";

// typeEffectiveness[attacker][defender] = multiplicador (0, 0.5, 1, 2)
function getMultiplierLabel(n) {
  if (n === 0) return "0";
  if (n === 0.5) return "½";
  if (n === 2) return "2";
  return "1";
}

// Colores suaves: verde apagado, rojo terroso, morado suave; celdas sin borde duro
function getCellClass(mult) {
  const base =
    "w-9 h-9 flex items-center justify-center text-sm font-bold rounded-md";
  if (mult === 0) return `${base} bg-transparent text-accent`;
  if (mult === 0.5) return `${base} bg-transparent text-destructive`;
  if (mult === 2) return `${base} bg-transparent text-emerald-500/90`;
  return `${base} bg-transparent text-muted-foreground`;
}

export default function TypeChart() {
  const [selectedAttacker, setSelectedAttacker] = useState(null);
  const [selectedDefender, setSelectedDefender] = useState(null);

  // Cuando este tipo ATACA: contra qué defensores hace 2x, 0.5x, 0x
  const superEffective =
    selectedAttacker &&
    allTypes.filter((def) => typeEffectiveness[selectedAttacker][def] === 2);
  const notVeryEffective =
    selectedAttacker &&
    allTypes.filter((def) => typeEffectiveness[selectedAttacker][def] === 0.5);
  const noEffect =
    selectedAttacker &&
    allTypes.filter((def) => typeEffectiveness[selectedAttacker][def] === 0);

  // Cuando este tipo DEFIENDE: qué atacantes le hacen 2x, 0.5x, 0x
  const weakTo =
    selectedDefender &&
    allTypes.filter((atk) => typeEffectiveness[atk][selectedDefender] === 2);
  const resists =
    selectedDefender &&
    allTypes.filter((atk) => typeEffectiveness[atk][selectedDefender] === 0.5);
  const immuneTo =
    selectedDefender &&
    allTypes.filter((atk) => typeEffectiveness[atk][selectedDefender] === 0);

  return (
    <div className="min-h-screen w-screen p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-foreground">
        Tabla de efectividad de tipos
      </h1>
      <p className="text-muted-foreground text-sm text-center mb-6 max-w-2xl mx-auto">
        Filas = tipo atacante (ATK), columnas = tipo defensor (DEF). Clic en una
        fila o columna para la referencia rápida.
      </p>

      
      <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-900/50 text-emerald-500/90 font-bold border border-border">
            2
          </span>
          Super Effective (2×)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-muted text-muted-foreground font-bold border border-border">
            1
          </span>
          Normal (1×)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-destructive/20 text-destructive font-bold border border-border">
            ½
          </span>
          Not Very Effective (½×)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-accent/20 text-accent font-bold border border-border">
            0
          </span>
          No Effect (0×)
        </span>
      </div>

      
      <div className="overflow-x-auto rounded-xl border border-border bg-card/80 backdrop-blur-md mb-8 max-w-6xl mx-auto shadow-xl">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-card backdrop-blur-md p-2 text-muted-foreground text-xs font-medium border-b border-border rounded-tl-xl">
                ATK / DEF
              </th>
              {allTypes.map((def) => (
                <th
                  key={def}
                  className={cn(
                    "p-1.5 min-w-9 border-b border-border cursor-pointer transition-all duration-200",
                    selectedDefender === def
                      ? "bg-primary/10 ring-1 ring-ring ring-inset rounded-t-lg"
                      : "hover:bg-muted",
                  )}
                  onClick={() => setSelectedDefender(def)}
                  title={def}
                >
                  <span
                    className={cn(
                      "inline-flex w-9 h-9 rounded-full items-center justify-center text-[10px] font-bold text-foreground opacity-90",
                      typeColors[def],
                    )}
                  >
                    {typeAbbrev[def]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allTypes.map((atk) => {
              const isSelectedRow = selectedAttacker === atk;
              return (
                <tr
                  key={atk}
                  onClick={() => setSelectedAttacker(atk)}
                  className={cn(
                    "border-b border-border cursor-pointer transition-all duration-200 last:border-b-0",
                    isSelectedRow
                      ? "bg-primary/10 hover:bg-primary/15"
                      : "hover:bg-muted",
                  )}
                >
                  <td className="sticky left-0 z-10 bg-inherit backdrop-blur-md p-1.5 border-r border-border rounded-l-md first:rounded-l-none">
                    <span className="opacity-90">
                      <TypeBadge type={atk} size="sm" />
                    </span>
                  </td>
                  {allTypes.map((def) => {
                    const mult = typeEffectiveness[atk][def];
                    const isSelectedCol = selectedDefender === def;
                    return (
                      <td
                        key={def}
                        className={cn(
                          "p-1 text-center align-middle",
                          isSelectedCol && "bg-primary/10",
                        )}
                      >
                        <span
                          className={cn(
                            getCellClass(mult),
                            "mx-auto inline-flex",
                          )}
                          title={`${atk} → ${def}: ${mult}×`}
                        >
                          {getMultiplierLabel(mult)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Referencia rápida - bordes suaves, mismo tono que la tabla */}
      <section className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-6 max-w-6xl mx-auto shadow-xl">
        <h2 className="text-lg font-bold text-foreground mb-4">
          Referencia rápida
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Atacando */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Ataque (attacking)
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {selectedAttacker ? (
                <span className="opacity-90">
                  <TypeBadge type={selectedAttacker} size="md" />
                </span>
              ) : (
                <span className="text-muted-foreground text-sm">
                  Clic en una fila de la tabla
                </span>
              )}
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-emerald-500/90 font-medium">
                  Super Effective (2×)
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedAttacker && superEffective?.length
                    ? superEffective.map((t) => (
                        <TypeBadge key={t} type={t} size="sm" />
                      ))
                    : selectedAttacker
                      ? "—"
                      : "—"}
                </div>
              </div>
              <div>
                <span className="text-destructive font-medium">
                  Not Very Effective (½×)
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedAttacker && notVeryEffective?.length
                    ? notVeryEffective.map((t) => (
                        <TypeBadge key={t} type={t} size="sm" />
                      ))
                    : selectedAttacker
                      ? "—"
                      : "—"}
                </div>
              </div>
              <div>
                <span className="text-accent font-medium">
                  No Effect (0×)
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedAttacker && noEffect?.length
                    ? noEffect.map((t) => (
                        <TypeBadge key={t} type={t} size="sm" />
                      ))
                    : selectedAttacker
                      ? "—"
                      : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Defendiendo */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Defensa (defending)
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {selectedDefender ? (
                <span className="opacity-90">
                  <TypeBadge type={selectedDefender} size="md" />
                </span>
              ) : (
                <span className="text-muted-foreground text-sm">
                  Clic en una columna de la tabla
                </span>
              )}
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-emerald-500/90 font-medium">
                  Weak to (2×)
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedDefender && weakTo?.length
                    ? weakTo.map((t) => (
                        <TypeBadge key={t} type={t} size="sm" />
                      ))
                    : selectedDefender
                      ? "—"
                      : "—"}
                </div>
              </div>
              <div>
                <span className="text-destructive font-medium">
                  Resists (½×)
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedDefender && resists?.length
                    ? resists.map((t) => (
                        <TypeBadge key={t} type={t} size="sm" />
                      ))
                    : selectedDefender
                      ? "—"
                      : "—"}
                </div>
              </div>
              <div>
                <span className="text-accent font-medium">
                  Immune to (0×)
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedDefender && immuneTo?.length
                    ? immuneTo.map((t) => (
                        <TypeBadge key={t} type={t} size="sm" />
                      ))
                    : selectedDefender
                      ? "—"
                      : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
