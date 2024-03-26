let url = [];
let url_Evolution = [];
let currentPokemon = [];
let pokemon_ev = [];
let pokemon_species = [];
let isLoading = false;

async function init(){
    const start = 1;
    const count = 31;
    await loadPokemon(start, count);
}
async function loadPokemon(start, count) {
    for (let i = start; i < count; i++) {
      const url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
      try {
        const resp = await fetch(url);
        const pokemonData = await resp.json();
        currentPokemon[i] = pokemonData;
        renderPokemon(i);
      } catch (error) {
        console.error("Fehler beim Laden von Pokemon:", error);
      }
    }
  }

function renderPokemon(i) {
    document.getElementById('Pokemon-Card').innerHTML += returnPokemonCard(i);
    returnTypeName(i);
    generateBackground(i);
}

function returnTypeName(i) {
    let typeName = '';
    for (let j = 0; j < currentPokemon[i]['types'].length; j++) {
        const type = currentPokemon[i]['types'][j].type.name;
        typeName += `<button class="btn btn-light" style="background-color:transparent; color:white;">${type}</button>`;
    }
    return typeName;
}

function returnPokemonCard(i) {

    let image_src = currentPokemon[i]['sprites']['other']['home'].front_default != null ? currentPokemon[i]['sprites']['other']['home'].front_default : currentPokemon[i]['sprites']['other']['official-artwork'].front_default;
    return ` <div id="pokedex-${i}" class="openendCard" onclick="openCard(${i})">
    <div class="idnumber"># ${(currentPokemon[i].id).toString().padStart(3, '0')}</div>
    <h1 id="pokemonName">${currentPokemon[i]['name']}</h1>
    <div style="display:flex; gap:16px;">${returnTypeName(i)}</div>
    <img src="${image_src}" id="pokemonImage" >
    </div>`;
}


function generateBackground(i) {
    const pokemontype = currentPokemon[i]['types'][0]['type'].name;
    const KartenElement = document.getElementById(`pokedex-${i}`);
    KartenElement.classList.add(pokemontype);
}

function openCard(i) {

    document.getElementById('search').classList.add('d-none');
    document.getElementById('loadButton').classList.add('d-none');
    document.getElementById('Pokemon-Card').style = 'flex-direction: column;';
    document.getElementById('Pokemon-Card').innerHTML = generateCardHtml(i);
    generateBackground(i);
    loadAbout(i);
}

async function CloseCard() {
    document.getElementById('search').classList.remove('d-none');

    document.getElementById('Pokemon-Card').style = 'flex-direction: row;';
    document.getElementById('Pokemon-Card').innerHTML ='';
    const start = 1;
    const count = currentPokemon.length;
    loadPokemon(start, count);
    document.getElementById('loadButton').classList.remove('d-none');
}

function nextPokemon(i) {
    start = currentPokemon.length - 1;
    if (i < start) {
        i++;
    }
    openCard(i);
}
function previousPokemon(i) {
    if (i > 1) {
        i--;
    }

    openCard(i);
}
function generateCardHtml(i) {
    let typeName = '';
    let image_src = currentPokemon[i]['sprites']['other']['home'].front_default != null ? currentPokemon[i]['sprites']['other']['home'].front_default : currentPokemon[i]['sprites']['other']['official-artwork'].front_default;
    for (let j = 0; j < currentPokemon[i]['types'].length; j++) {
        const type = currentPokemon[i]['types'][j].type.name;
        typeName += `<button class="btn btn-light" style="background-color:transparent; color:white">${type}</button>`;
    }

    return `<div id="pokedex-${i}" class="pokedexCard">
    <div class="div-close" ><div class="idnumber"># ${(currentPokemon[i].id).toString().padStart(3, '0')}</div>
    <img src="./img/close.png" style="padding-left:8px; width: 50px;" onclick="CloseCard(${i})"></div>
    <h1 id="pokemonName">${currentPokemon[i]['name']}</h1>
    <div style="display:flex; gap:16px;">${typeName}</div>
    <div class="imgContainer">
    <img src="./img/chevron-left.png"  onclick="previousPokemon(${i})"  class="imgArrow">
    <img src="${image_src}" id="pokemonImage" style="z-index:1;">
    <img src="./img/chevron-right.png" onclick="nextPokemon(${i})" class="imgArrow">
    </div>
    </div>
    <div id="info-container">
         <nav>
         <a href="javascript:loadAbout(${i});" id="about">About</a>
         <a href="javascript:loadStats(${i});" id="stats">Base Stats</a>
         <a href="javascript:loadEvolution(${i});" id="evolution">Evolution</a>
         <a href="javascript:loadMoves(${i});" id="moves">Moves</a>
         </nav>
         <div id="details" style="display:flex; justify-content:center; flex-direction:column; align-items:center; padding:20px;">
         </div>
         </div>`;
}



/////////////////////// abouts / stats / evolutions / moves ////////////////////////////////////////////////////////////

function loadAbout(i) {
    document.getElementById('details').classList.remove('moves');
    document.getElementById('details').classList.remove('d-block');
    const abilities = currentPokemon[i]['abilities'];

    let abilityHtml = '';
    for (let j = 0; j < abilities.length; j++) {
        const ability = abilities[j]['ability'].name;
        abilityHtml += `<b>${ability} </b>`;

        if (j < abilities.length - 1) {
            abilityHtml += ', ';
        }
    }
    generateAbout(i, abilityHtml);
}
function generateAbout(i, abilityHtml) {
    document.getElementById('details').innerHTML = `
    <table>
      <tr class="aboutTable">
        <td>Species</td>
        <td><b>${currentPokemon[i]['species'].name}</b></td>
      </tr>
      <tr class="aboutTable">
        <td>Height</td>
        <td><b>${currentPokemon[i]['height']}</b></td>
      </tr>
      <tr class="aboutTable">
        <td>Weight</td>
        <td><b>${currentPokemon[i]['weight']}</b></td>
      </tr>
      <tr class="aboutTable">
        <td>Abilities</td>
        <td>
          ${abilityHtml}
        </td>
      </tr>
    </table>`;
}
function loadStats(i) {
    document.getElementById('details').innerHTML = '';
    document.getElementById('details').classList.remove('moves');
    // document.getElementById('details').style.display = 'block';
    for (let j = 0; j < currentPokemon[i]['stats'].length; j++) {
        const stat = currentPokemon[i]['stats'][j]['base_stat'];
        const name = currentPokemon[i]['stats'][j].stat.name;
        document.getElementById('details').innerHTML += `<div style="width:100%; padding-left:50px;">
        <div style="width:100%; padding-right:20px;">${name}</div>
        <div class="progress" role="progressbar" aria-label="Default striped example" aria-valuenow="${stat}" aria-valuemin="0" aria-valuemax="100" style="width:70%;">
        <div class="progress-bar progress-bar-striped ${currentPokemon[i]['types'][0]['type'].name}" style="width: ${stat}%">${stat}%</div>
        </div>
        </div>`;
    }
}

async function loadEvolution(i) {
    const detailsElement = document.getElementById('details');
    detailsElement.style.display = 'flex';
    detailsElement.className = '';

    const pokemonName = currentPokemon[i]['species']['name'];

    for (let j = 1; j < currentPokemon.length; j++) {
        const url_Evolution = `https://pokeapi.co/api/v2/evolution-chain/${j}/`;
        const response = await fetch(url_Evolution);
        const pokemon_species = await response.json();
        const pokemonSpecies = pokemon_species['chain'];

        if (
            pokemonName === pokemonSpecies['species']['name'] ||
            (
                pokemonSpecies.evolves_to.length > 0 &&
                (
                    pokemonName === pokemonSpecies.evolves_to[0].species.name ||
                    (
                        pokemonSpecies.evolves_to[0].evolves_to.length > 0 &&
                        pokemonName === pokemonSpecies.evolves_to[0].evolves_to[0].species.name
                    )
                )
            )
        ) {
            let evolutionHtml = '';
            let currentChain = pokemonSpecies;

            while (currentChain) {
                evolutionHtml += `<div style="display: flex; flex-direction: column; align-items: center;">
                    <img src="${await getPokemonImage(currentChain['species']['url'])}" style="cursor:pointer;" width="100px">
                    ${currentChain['species']['name']}
                </div>`;
                currentChain = currentChain.evolves_to[0];
            }

            detailsElement.innerHTML = evolutionHtml;
            break; // End the loop after finding the evolution chain
        }
    }
}
// Hilfsfunktion zum Abrufen der Bild-URL eines Pokémon aus dessen API-URL
async function getPokemonImage(pokemonUrl) {

    let response = await fetch(pokemonUrl);
    let pokemonData = await response.json();
    let pokemonResp = await fetch(`${pokemonData['varieties'][0]['pokemon']['url']}`);
    let resultPokemon = await pokemonResp.json();
    let image_src = resultPokemon['sprites']['other']['home'].front_default != null ? resultPokemon['sprites']['other']['home'].front_default : resultPokemon['sprites']['other']['official-artwork'].front_default;
    return image_src;
}

function loadMoves(i) {
    document.getElementById('details').innerHTML = '';
    document.getElementById('details').classList.add('moves');
    document.getElementById('details').classList.add('d-block');

    for (let j = 0; j < currentPokemon[i]['moves'].length; j++) {
        const move = currentPokemon[i]['moves'][j].move;
        document.getElementById('details').innerHTML += `<div class="movesDetail">${move.name}</div><br>`;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function SearchPokemon() {
    document.getElementById('loadButton').style.display = 'none';
    let inputText = document.getElementById('inputfeld').value.toLowerCase();
    const pokemonCardContainer = document.getElementById('Pokemon-Card');
    pokemonCardContainer.innerHTML = '';
    for (let i = 1; i < currentPokemon.length; i++) {
        const pokemonName = currentPokemon[i]['name'].toLowerCase();

        if (pokemonName.includes(inputText) || inputText.length < 1) {
            pokemonCardContainer.innerHTML += returnPokemonCard(i);
            generateBackground(i);
        }
    }
}


 // Globale Variable, um den Ladezustand zu verfolgen

 async function loadMore() {
    if (isLoading) {
      return;
    }

    const loadButton = document.getElementById('loadButton');
    loadButton.disabled = true;
  
    isLoading = true;
    try {
      const start = currentPokemon.length;
      const count = start + 30;
      await loadPokemon(start, count);
    } finally {
      loadButton.disabled = false;
      isLoading = false;
    }
  }

