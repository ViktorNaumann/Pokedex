// Optimierter script.js
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
  const existingCard = document.getElementById(`pokemon-${data.id}`);
  if (!existingCard) {
    const cardHTML = templateHtmlRenderPokemon(data);
    pokemonList.innerHTML += cardHTML.replace('<div class="pokemon-card', `<div id="pokemon-${data.id}" class="pokemon-card`);
  }
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
  const existing = allPokemonData.find(p => p.id === i || p.name === i) || searchedPokemonData.find(p => p.id === i || p.name === i);
  if (existing) return existing;
  const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
  const response = await fetch(url);
  if (!response.ok) {
    alert("The Pokemon does not exist!");
    return null;
  }
  const data = await response.json();
  createCard(data);
  if (shouldSave && !allPokemonData.some(p => p.id === data.id)) {
    allPokemonData.push(data);
  }
  return data;
}

async function loadAllPokemonNames() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
  const data = await response.json();
  allPokemonName = data.results.map(pokemon => pokemon.name);
}

async function fetchAndDisplayFilteredPokemon(filteredPokemon) {
  const spinner = document.getElementById("spinner-overlay");
  spinner.classList.remove("hidden");
  const promises = filteredPokemon.map(name => getPokemon(name, false));
  const results = await Promise.all(promises);
  results.forEach(data => {
    if (data && data.id <= 1025 && !searchedPokemonData.some(p => p.id === data.id)) {
      searchedPokemonData.push(data);
    }
  });
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
  const loadMoreButton = document.getElementById("load-more-button");
  if (!input) return resetSearch();
  const filtered = allPokemonName.filter(name => name.startsWith(input));
  if (!filtered.length) return alert("No Pokemon found!");
  list.innerHTML = "";
  searchedPokemonData = [];
  loadMoreButton.parentElement.classList.add("hidden");
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
  const loadMoreButton = document.getElementById("load-more-button");
  pokemonList.innerHTML = "";
  allPokemonData.forEach(pokemon => createCard(pokemon));
  loadMoreButton.parentElement.classList.remove("hidden");
}

function showDetails(pokemonId) {
  let pokemon = allPokemonData.find(p => p.id === pokemonId) || searchedPokemonData.find(p => p.id === pokemonId);
  if (!pokemon) {
    alert("No Pokemon found!");
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
  }
});

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













