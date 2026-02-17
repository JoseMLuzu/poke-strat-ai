const BASE_URL = "https://pokeapi.co/api/v2";

/* ===============================
   🔹 Get Pokémons List
================================= */
export async function getPokemons(limit = 1025, offset = 0) {
  try {
    const res = await fetch(
      `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    );

    if (!res.ok) throw new Error("Failed to fetch Pokémon list");

    const data = await res.json();

    const detailedPokemons = await Promise.all(
      data.results.map(async (p) => {
        const resDetail = await fetch(p.url);
        const details = await resDetail.json();

        return {
          id: details.id,
          name: details.name,
          image:
            details.sprites.other["official-artwork"].front_default ||
            details.sprites.other["home"].front_default ||
            details.sprites.front_default,
          types: details.types.map((t) => t.type.name),
          number: details.id,
        };
      }),
    );

    return detailedPokemons;
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
    return [];
  }
}

/* ===============================
   🔹 Extract Evolution Requirements
================================= */
function extractRequirements(details) {
  if (!details) return [];

  const requirements = [];

  if (details.min_level)
    requirements.push({ type: "level", value: details.min_level });

  if (details.min_happiness) requirements.push({ type: "friendship" });

  if (details.min_affection) requirements.push({ type: "affection" });

  if (details.min_beauty) requirements.push({ type: "beauty" });

  if (details.item)
    requirements.push({
      type: "item",
      value: details.item.name.replace(/-/g, " "),
    });

  if (details.held_item)
    requirements.push({
      type: "held-item",
      value: details.held_item.name.replace(/-/g, " "),
    });

  if (details?.trigger?.name === "trade") requirements.push({ type: "trade" });

  if (details.time_of_day)
    requirements.push({
      type: "time",
      value: details.time_of_day,
    });

  if (details.gender !== null && details.gender !== undefined)
    requirements.push({
      type: "gender",
      value: details.gender === 1 ? "female" : "male",
    });

  if (details.known_move)
    requirements.push({
      type: "move",
      value: details.known_move.name.replace(/-/g, " "),
    });

  if (details.known_move_type)
    requirements.push({
      type: "move-type",
      value: details.known_move_type.name,
    });

  if (details.location)
    requirements.push({
      type: "location",
      value: details.location.name.replace(/-/g, " "),
    });

  return requirements;
}

/* ===============================
   🔹 Get Pokémon Details
================================= */
export async function getPokemonDetails(idOrName) {
  try {
    const [pokemonRes, speciesRes] = await Promise.all([
      fetch(`${BASE_URL}/pokemon/${idOrName}`),
      fetch(`${BASE_URL}/pokemon-species/${idOrName}`),
    ]);

    if (!pokemonRes.ok) throw new Error("Pokémon not found");

    const details = await pokemonRes.json();
    const speciesData = await speciesRes.json();

    /* ===============================
       📖 Description
    ================================= */
    const englishEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en",
    );

    const description = englishEntry
      ? englishEntry.flavor_text.replace(/\f/g, " ")
      : "No description available.";

    /* ===============================
       🎯 Fetch Moves With Type
    ================================= */
    const moves = await Promise.all(
      details.moves.slice(0, 10).map(async (m) => {
        const res = await fetch(m.move.url);
        const moveData = await res.json();

        return {
          name: m.move.name,
          type: moveData.type.name,
        };
      }),
    );

    /* ===============================
       🧬 Evolution Chain
    ================================= */
    let evolutions = [];

    try {
      const evolutionRes = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionRes.json();

      const chain = evolutionData.chain;

      async function buildEvolutionList(
        node,
        evolutionDetailsFromParent = null,
        list = [],
      ) {
        const pokemonRes = await fetch(
          `${BASE_URL}/pokemon/${node.species.name}`,
        );
        const pokemonData = await pokemonRes.json();

        const requirements = evolutionDetailsFromParent
          ? extractRequirements(evolutionDetailsFromParent)
          : [];

        list.push({
          id: pokemonData.id,
          name: pokemonData.name,
          image:
            pokemonData.sprites.other["official-artwork"].front_default ||
            pokemonData.sprites.front_default,
          isCurrent: pokemonData.name === details.name,
          requirements,
        });

        for (const evo of node.evolves_to) {
          await buildEvolutionList(evo, evo.evolution_details?.[0], list);
        }

        return list;
      }

      evolutions = await buildEvolutionList(chain);
    } catch (err) {
      console.error("Evolution fetch error:", err);
    }

    /* ===============================
       📦 Return Clean Object
    ================================= */
    return {
      id: details.id,
      name: details.name,
      image:
        details.sprites.other["official-artwork"].front_default ||
        details.sprites.other["home"].front_default ||
        details.sprites.front_default,
      types: details.types.map((t) => t.type.name),
      number: details.id,
      height: details.height / 10,
      weight: details.weight / 10,
      description,
      stats: details.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
      abilities: details.abilities.map((ability) => ({
        name: ability.ability.name,
        isHidden: ability.is_hidden,
      })),
      moves, // ✅ ahora es [{ name, type }]
      evolutions,
    };
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
    throw error;
  }
}
