let allPokemonData = [];

function init() {
  getData();
}

async function getData() {
  const spinner = document.getElementById("spinner-overlay");
  spinner.classList.remove("hidden");
  for (let i = 1; i <= 20; i++) {
    await getPokemon(i);
  }
  spinner.classList.add("hidden");
}

function createCard(data) {
  const pokemonList = document.getElementById("pokemon-list");
  pokemonList.innerHTML += templateHtmlRenderPokemon(data);
}

function templateHtmlRenderPokemon(data) {
  return /*html*/ `
      <div class="pokemon-card bg_${data.types[0].type.name}">
        <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
        <img src="${data.sprites.versions["generation-v"]["black-white"].animated.front_default}">
        <p><strong>#${data.id}</strong></p>
        <p><strong>Typ: ${data.types.map((typeInfo) => typeInfo.type.name).join(", ")}</strong></p>
      </div>
    `;
}

async function loadMorePokemon() {
  const spinner = document.getElementById("spinner-overlay");
  spinner.classList.remove("hidden");
  const startIndex = allPokemonData.length + 1;
  const endIndex = startIndex + 19;

  for (let i = startIndex; i <= endIndex; i++) {
    await getPokemon(i);
  }
  spinner.classList.add("hidden");
}

async function searchPokemon() {
  const searchInput = document.getElementById("search").value.toLowerCase();
  const pokemonList = document.getElementById("pokemon-list");
  const spinner = document.getElementById("spinner-overlay");
  pokemonList.innerHTML = "";
  spinner.classList.remove("hidden");
  await getPokemon(searchInput);
  spinner.classList.add("hidden");
}

async function getPokemon(i) {
  const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
  const response = await fetch(url);
  if (url.status === 404) {
    alert("Pokemon existiert nicht!");
    return;
  }
  const data = await response.json();
  createCard(data);
  allPokemonData.push(data);
}


