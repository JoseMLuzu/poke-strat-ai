export async function getPokemons(limit = 20, offset = 0) {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
  );
  const data = await res.json();
  return data.results;
}
