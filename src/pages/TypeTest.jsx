import { getTypeEffectiveness } from "../utils/typeChart";

export default function TypeTest() {
  // Ejemplo de Pokémon
  const pikachu = ["electric"];
  const bulbasaur = ["grass", "poison"];

  const pikachuEffect = getTypeEffectiveness(pikachu);
  const bulbasaurEffect = getTypeEffectiveness(bulbasaur);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Type Test</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Pikachu</h2>
        <p>Weaknesses: {pikachuEffect.weaknesses.join(", ")}</p>
        <p>Strengths: {pikachuEffect.strengths.join(", ")}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Bulbasaur</h2>
        <p>Weaknesses: {bulbasaurEffect.weaknesses.join(", ")}</p>
        <p>Strengths: {bulbasaurEffect.strengths.join(", ")}</p>
      </div>
    </div>
  );
}
