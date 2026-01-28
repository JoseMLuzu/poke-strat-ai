// api.js
export async function getPokemons(limit = 20, offset = 0) {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
    );
    const data = await res.json();

    // Traer detalles completos de cada Pokémon
    const detailedPokemons = await Promise.all(
      data.results.map(async (p) => {
        const resDetail = await fetch(p.url);
        const details = await resDetail.json();
        return {
          id: details.id,
          name: details.name,
          image: details.sprites.front_default,
          types: details.types.map((t) => t.type.name),
        };
      }),
    );

    return detailedPokemons;
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    return [];
  }
}
