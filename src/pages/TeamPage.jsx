import { useState, useEffect } from "react";
import TeamBuilder from "../components/TeamBuilder";
import { getPokemons } from "../utils/api";

export default function TeamPage() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getPokemons();
      setPokemons(data);
    }
    fetchData();
  }, []);

  return <TeamBuilder pokemons={pokemons} />;
}
