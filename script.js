let allPokemonData = [];
let allPokemonName = [];
let searchedPokemonData = [];

async function init() {
  await getData();
  await loadAllPokemonNames();
  setupAutoResetSearch();
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

async function loadMorePokemon() {
  const spinner = document.getElementById("spinner-overlay");
  spinner.classList.remove("hidden");
  const startIndex = allPokemonData.length + 1;
  const endIndex = Math.min(startIndex + 19, 1025);
  for (let i = startIndex; i <= endIndex; i++) {
    await getPokemon(i);
  }
  spinner.classList.add("hidden");
}

async function getPokemon(i, shouldSave = true) {
  const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
  const response = await fetch(url);
  if (!response.ok) {
    alert("Pokémon existiert nicht!");
    return null;
  }
  const data = await response.json();
  createCard(data);
  if (shouldSave) {
    const alreadyExists = allPokemonData.some(pokemon => pokemon.id === data.id);
    if (!alreadyExists) {
      allPokemonData.push(data);}
  }
  return data;
}

async function loadAllPokemonNames() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
  const data = await response.json();
  allPokemonName = data.results.map((pokemon) => pokemon.name);
}

async function fetchAndDisplayFilteredPokemon(filteredPokemon) {
  const spinner = document.getElementById("spinner-overlay");
  spinner.classList.remove("hidden");
  for (const name of filteredPokemon) {
    const data = await getPokemon(name, false);
    if (data && data.id <= 1025) {
      searchedPokemonData.push(data);
    }
  }
  spinner.classList.add("hidden");
}


async function resetSearch() {
  document.getElementById("pokemon-list").innerHTML = "";
  allPokemonData = [];
  await getData();
}

async function searchPokemon() {
  const input = document.getElementById("search").value.toLowerCase();
  const list = document.getElementById("pokemon-list");
  if (!input) return resetSearch();
  const filtered = allPokemonName.filter(name => name.startsWith(input));
  if (!filtered.length) return alert("Kein Pokémon gefunden!");
  list.innerHTML = "";
  searchedPokemonData = [];
  await fetchAndDisplayFilteredPokemon(filtered);
}

function setupAutoResetSearch() {
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", () => {
    if (searchInput.value === "") {
      resetToStartView();
    }
  });
}

function resetToStartView() {
  const pokemonList = document.getElementById("pokemon-list");
  pokemonList.innerHTML = "";
  allPokemonData.forEach((pokemon) => createCard(pokemon));
}

function showDetails(pokemonId) {
  let pokemon = allPokemonData.find(p => p.id === pokemonId);
  if (!pokemon) {
    pokemon = searchedPokemonData.find(p => p.id === pokemonId);
  }
  if (!pokemon) {
    alert("Pokémon nicht gefunden!");
    return;
  }
  const detailsContainer = document.getElementById("details-content");
  detailsContainer.innerHTML = templateHtmlRenderDetails(pokemon, allPokemonData);
  document.getElementById("pokemon-details").classList.remove("hidden");
  document.body.classList.add("no-scroll");
}

function closeDetails() {
  const overlay = document.getElementById("pokemon-details");
  overlay.classList.add("hidden");
  document.body.classList.remove("fixed-position");
  document.body.classList.remove("no-scroll");
  document.body.style.top = '';
}

document.getElementById("pokemon-details").addEventListener("click", function(event) {
  if (event.target.id === "pokemon-details") {
    closeDetails();
  }}
);

function showPreviousPokemon(currentId) {
  const currentIndex = allPokemonData.findIndex(pokemon => pokemon.id === currentId);
  if (currentIndex > 0) {
    const previousPokemon = allPokemonData[currentIndex - 1];
    const detailsContainer = document.getElementById("details-content");
    detailsContainer.innerHTML = templateHtmlRenderDetails(previousPokemon, allPokemonData);
  }
}

function showNextPokemon(currentId) {
  const currentIndex = allPokemonData.findIndex(pokemon => pokemon.id === currentId);
  if (currentIndex < allPokemonData.length - 1) {
    const nextPokemon = allPokemonData[currentIndex + 1];
    const detailsContainer = document.getElementById("details-content");
    detailsContainer.innerHTML = templateHtmlRenderDetails(nextPokemon, allPokemonData);
  }
}

function showTab(tabName) {
  const aboutTab = document.getElementById("about-tab");
  const statsTab = document.getElementById("stats-tab");
  aboutTab.classList.add("hidden");
  statsTab.classList.add("hidden");
  if (tabName === "about") {
    aboutTab.classList.remove("hidden");
  } else if (tabName === "stats") {
    statsTab.classList.remove("hidden");
  }
}












