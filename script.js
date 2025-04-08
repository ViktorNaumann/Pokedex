let allPokemonData = [];

function init() {
  getData();
}

async function getData() {
  const spinner = document.getElementById("spinner-overlay");

  spinner.classList.remove("hidden");
  for (let i = 1; i <= 20; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    const response = await fetch(url);
    const data = await response.json();
    createCard(data);
    allPokemonData.push(data);
    console.log(data);
  }
  spinner.classList.add("hidden");
}

function createCard(data) {
    const pokemonList = document.getElementById('pokemon-list');
    pokemonList.innerHTML += templateHtmlRenderPokemon(data);
  }
  
function templateHtmlRenderPokemon(data) {
    return /*html*/`
      <div class="pokemon-card bg_${data.types[0].type.name}">
        <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
        <img src="${data.sprites.front_default}">
        <p><strong>#${data.id}</strong></p>
        <p>Typ: ${data.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
      </div>
    `;
  }

  async function loadMorePokemon() {
    const spinner = document.getElementById("spinner-overlay");
    spinner.classList.remove("hidden");
  
    const startIndex = allPokemonData.length + 1;
    const endIndex = startIndex + 19;
  
    for (let i = startIndex; i <= endIndex; i++) {
      const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
      const response = await fetch(url);
      const data = await response.json();
      createCard(data);
      allPokemonData.push(data);
    }
    spinner.classList.add("hidden");
  }
  

 
