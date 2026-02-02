// api.js
export async function getPokemons(limit = 1025, offset = 0) {
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
          image:
            details.sprites.other["official-artwork"].front_default ||
            details.sprites.other["home"].front_default ||
            details.sprites.front_default,

          types: details.types.map((t) => t.type.name),
          number: details.order,
        };
      }),
    );

    return detailedPokemons;
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    return [];
  }
}

async function getEvolutionChain(speciesUrl) {
  try {
    const speciesRes = await fetch(speciesUrl);
    const speciesData = await speciesRes.json();
    
    const evolutionChainRes = await fetch(speciesData.evolution_chain.url);
    const evolutionChainData = await evolutionChainRes.json();
    
    return evolutionChainData.chain;
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
    return null;
  }
}

function extractRequirements(evolutionDetails) {
  const requirements = [];
  
  // Nivel requerido
  if (evolutionDetails.min_level) {
    requirements.push(`Nivel ${evolutionDetails.min_level}`);
  }
  
  // Objeto requerido
  if (evolutionDetails.item) {
    const itemName = evolutionDetails.item.name.replace(/-/g, " ");
    requirements.push(`Objeto: ${itemName}`);
  }
  
  // Condiciones especiales
  if (evolutionDetails.trigger.name === "trade") {
    requirements.push("Intercambio");
    if (evolutionDetails.trade_species) {
      requirements.push(`con ${evolutionDetails.trade_species.name.replace(/-/g, " ")}`);
    }
  }
  
  if (evolutionDetails.trigger.name === "use-item") {
    const itemName = evolutionDetails.item?.name.replace(/-/g, " ") || "especial";
    requirements.push(`Usar objeto: ${itemName}`);
  }
  
  if (evolutionDetails.time_of_day) {
    const time = evolutionDetails.time_of_day === "day" ? "Día" : 
                 evolutionDetails.time_of_day === "night" ? "Noche" : 
                 evolutionDetails.time_of_day;
    requirements.push(`Hora: ${time}`);
  }
  
  if (evolutionDetails.min_happiness) {
    requirements.push(`Felicidad: ${evolutionDetails.min_happiness}`);
  }
  
  if (evolutionDetails.min_affection) {
    requirements.push(`Afecto: ${evolutionDetails.min_affection}`);
  }
  
  if (evolutionDetails.known_move_type) {
    requirements.push(`Movimiento tipo: ${evolutionDetails.known_move_type.name}`);
  }
  
  if (evolutionDetails.known_move) {
    requirements.push(`Movimiento: ${evolutionDetails.known_move.name.replace(/-/g, " ")}`);
  }
  
  if (evolutionDetails.location) {
    requirements.push(`Ubicación: ${evolutionDetails.location.name.replace(/-/g, " ")}`);
  }
  
  if (evolutionDetails.gender) {
    requirements.push(`Género: ${evolutionDetails.gender === 1 ? "Femenino" : "Masculino"}`);
  }
  
  if (evolutionDetails.needs_overworld_rain) {
    requirements.push("Lluvia");
  }
  
  if (evolutionDetails.relative_physical_stats !== null) {
    if (evolutionDetails.relative_physical_stats === 1) {
      requirements.push("Ataque > Defensa");
    } else if (evolutionDetails.relative_physical_stats === -1) {
      requirements.push("Defensa > Ataque");
    } else {
      requirements.push("Ataque = Defensa");
    }
  }
  
  if (evolutionDetails.party_species) {
    requirements.push(`Pokémon en equipo: ${evolutionDetails.party_species.name.replace(/-/g, " ")}`);
  }
  
  if (evolutionDetails.party_type) {
    requirements.push(`Tipo en equipo: ${evolutionDetails.party_type.name}`);
  }
  
  if (evolutionDetails.turn_upside_down) {
    requirements.push("Consola boca abajo");
  }
  
  if (requirements.length === 0 && evolutionDetails.trigger.name === "level-up") {
    requirements.push("Subir de nivel");
  }
  
  return requirements;
}

function buildEvolutionChain(chain, chainList = []) {
  const pokemonName = chain.species.name;
  
  // Agregar el Pokémon base
  chainList.push({
    name: pokemonName,
    requirements: [],
    evolvesTo: [],
  });
  
  const currentIndex = chainList.length - 1;
  
  // Procesar evoluciones
  chain.evolves_to.forEach((evolution) => {
    const evolutionDetails = evolution.evolution_details[0];
    const requirements = extractRequirements(evolutionDetails);
    
    const evolutionData = {
      name: evolution.species.name,
      requirements: requirements,
      evolvesTo: [],
    };
    
    chainList[currentIndex].evolvesTo.push(evolutionData);
    
    // Procesar recursivamente las siguientes evoluciones
    if (evolution.evolves_to.length > 0) {
      buildEvolutionChain(evolution, chainList);
    }
  });
  
  return chainList;
}

export async function getPokemonDetails(idOrName) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
    if (!res.ok) {
      throw new Error("Pokémon not found");
    }
    const details = await res.json();

    // Obtener información de evoluciones
    const evolutionChain = await getEvolutionChain(details.species.url);
    
    let evolutions = [];
    if (evolutionChain) {
      // Extraer todos los Pokémon de la cadena de evolución
      function extractAllPokemon(chain, list = []) {
        list.push({
          name: chain.species.name,
          evolvesTo: chain.evolves_to.map((evo) => ({
            name: evo.species.name,
            requirements: extractRequirements(evo.evolution_details[0]),
          })),
        });
        chain.evolves_to.forEach((evo) => extractAllPokemon(evo, list));
        return list;
      }
      
      const chainData = extractAllPokemon(evolutionChain);
      
      // Obtener imágenes e IDs de todos los Pokémon en la cadena
      const uniquePokemonNames = [...new Set(chainData.map((p) => p.name))];
      
      const chainPokemonDetails = await Promise.all(
        uniquePokemonNames.map(async (name) => {
          try {
            const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const pokemonData = await pokemonRes.json();
            
            // Encontrar los requisitos de evolución para este Pokémon
            const evolutionInfo = chainData.find((p) => 
              p.evolvesTo.some((evo) => evo.name === name)
            );
            
            return {
              name: pokemonData.name,
              id: pokemonData.id,
              image:
                pokemonData.sprites.other["official-artwork"].front_default ||
                pokemonData.sprites.other["home"].front_default ||
                pokemonData.sprites.front_default,
              requirements: evolutionInfo?.evolvesTo.find((evo) => evo.name === name)?.requirements || [],
              isCurrent: pokemonData.name === details.name,
              order: pokemonData.order, // Para ordenar por número de Pokédex
            };
          } catch (err) {
            return null;
          }
        })
      );
      
      // Filtrar y ordenar por número de Pokédex
      evolutions = chainPokemonDetails
        .filter(Boolean)
        .sort((a, b) => a.order - b.order);
    }

    return {
      id: details.id,
      name: details.name,
      image:
        details.sprites.other["official-artwork"].front_default ||
        details.sprites.other["home"].front_default ||
        details.sprites.front_default,
      types: details.types.map((t) => t.type.name),
      number: details.order,
      height: details.height / 10, // Convertir de decímetros a metros
      weight: details.weight / 10, // Convertir de hectogramos a kg
      stats: details.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
      abilities: details.abilities.map((ability) => ({
        name: ability.ability.name,
        isHidden: ability.is_hidden,
      })),
      moves: details.moves.slice(0, 10).map((move) => move.move.name), // Primeros 10 movimientos
      evolutions: evolutions,
    };
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
    throw error;
  }
}
