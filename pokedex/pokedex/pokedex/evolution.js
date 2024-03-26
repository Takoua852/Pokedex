async function loadEvolution(i) {
    const detailsElement = document.getElementById('details');
    detailsElement.style.display = 'flex';
    detailsElement.className = '';

    const pokemonName = currentPokemon[i]['species']['name'];
    await fetchEvolutionChain(pokemonName);

}

async function fetchEvolutionChain(pokemonName) {
    const detailsElement = document.getElementById('details');
    detailsElement.innerHTML = '';

    for (let j = 1; j < currentPokemon.length; j++) {
        const url_Evolution = `https://pokeapi.co/api/v2/evolution-chain/${j}/`;
        try {
            const response = await fetch(url_Evolution);
            if (!response.ok) {
                // Wenn die Antwort nicht erfolgreich ist, überspringen Sie diese Iteration
                continue;
            }
            const pokemon_species = await response.json();
            const evolutionChain = pokemon_species['chain'];

            if (pokemonName === evolutionChain['species']['name'] ||
                (evolutionChain.evolves_to.length > 0 && (pokemonName === evolutionChain.evolves_to[0].species.name ||
                    (evolutionChain.evolves_to[0].evolves_to.length > 0 && pokemonName === evolutionChain.evolves_to[0].evolves_to[0].species.name)))
            ) {
                detailsElement.innerHTML = await generateEvolutionHtml(evolutionChain);
                return; // Beenden Sie die Funktion nach dem Finden der Evolutionskette
            }
        } catch (error) {
            continue;
        }
    }
}

async function generateEvolutionHtml(evolutionChain) {
    let evolutionHtml = '';
    let currentChain = evolutionChain;

    while (currentChain) {
        evolutionHtml += `<div style="display: flex; flex-direction: column; align-items: center;">
        <img src="${await getPokemonImage(currentChain['species']['url'])}" style="cursor:pointer;" width="100px">
        ${currentChain['species']['name']}
        </div>`;
        currentChain = currentChain.evolves_to[0];
    }
    return evolutionHtml;
}

async function getPokemonImage(pokemonUrl) {

    let response = await fetch(pokemonUrl);
    let pokemonData = await response.json();
    let pokemonResp = await fetch(`${pokemonData['varieties'][0]['pokemon']['url']}`);
    let resultPokemon = await pokemonResp.json();
    let image_src = resultPokemon['sprites']['other']['home'].front_default != null ? resultPokemon['sprites']['other']['home'].front_default : resultPokemon['sprites']['other']['official-artwork'].front_default;
    return image_src;
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



































