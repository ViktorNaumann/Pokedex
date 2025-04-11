let allPokemonData = [];
let allPokemonName = [];
let searchedPokemonData = [];

// Initialisierung der Seite
async function init() {
  await getData();
  await loadAllPokemonNames();
  setupAutoResetSearch();
}

// Start-Daten laden (z.B. 20 Pokémon)
async function getData() {
  const spinner = document.getElementById("spinner-overlay");
  spinner.classList.remove("hidden");
  for (let i = 1; i <= 20; i++) {
    await getPokemon(i);
  }
  spinner.classList.add("hidden");
}
// Pokémon-Karte erstellen und zur Liste hinzufügen
function createCard(data) {
  const pokemonList = document.getElementById("pokemon-list");
  pokemonList.innerHTML += templateHtmlRenderPokemon(data);
}

// Mehr Pokémon laden (Pagination)
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
// Pokémon laden, optional ins Haupt-Array speichern
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
      allPokemonData.push(data);
    }
  }
  return data;
}

// Alle Pokémon-Namen für die Suche laden
async function loadAllPokemonNames() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
  const data = await response.json();
  allPokemonName = data.results.map((pokemon) => pokemon.name);
}
// Suchfunktion für Pokémon
async function searchPokemon() {
  const searchInput = document.getElementById("search").value.toLowerCase();
  const pokemonList = document.getElementById("pokemon-list");

  if (searchInput === "") {
    pokemonList.innerHTML = "";
    allPokemonData = []; // Array leeren für frischen Start
    await getData();
    return;
  }

  pokemonList.innerHTML = "";
  searchedPokemonData = []; // Hier leerst du das Array für eine neue Suche!

  const filteredPokemon = allPokemonName.filter((pokemon) =>
    pokemon.toLowerCase().startsWith(searchInput)
  );

  if (filteredPokemon.length === 0) {
    alert("Kein Pokémon gefunden!");
    return;
  }

  const spinner = document.getElementById("spinner-overlay");
  spinner.classList.remove("hidden");

  for (const pokemon of filteredPokemon) {
    const data = await getPokemon(pokemon, false); // wichtig: Rückgabe vom getPokemon nutzen
    if (data) {
      searchedPokemonData.push(data); // Hier speichern!
    }
  }
  spinner.classList.add("hidden");
}

// Event-Listener für automatische Rückkehr zur Startansicht
function setupAutoResetSearch() {
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", () => {
    if (searchInput.value === "") {
      resetToStartView();
    }
  });
}
// Ansicht zurücksetzen auf Start-Ansicht
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
  detailsContainer.innerHTML = templateHtmlRenderDetails(pokemon);
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
// Hier dein Event Listener:
document.getElementById("pokemon-details").addEventListener("click", function(event) {
  // Nur schließen, wenn außerhalb der details-card geklickt wird
  if (event.target.id === "pokemon-details") {
    closeDetails();
  }
});

function showPreviousPokemon(currentId) {
  const currentIndex = allPokemonData.findIndex(pokemon => pokemon.id === currentId);
  if (currentIndex > 0) {
    const previousPokemon = allPokemonData[currentIndex - 1];
    const detailsContainer = document.getElementById("details-content");
    detailsContainer.innerHTML = templateHtmlRenderDetails(previousPokemon);
  }
}

function showNextPokemon(currentId) {
  const currentIndex = allPokemonData.findIndex(pokemon => pokemon.id === currentId);
  if (currentIndex < allPokemonData.length - 1) {
    const nextPokemon = allPokemonData[currentIndex + 1];
    const detailsContainer = document.getElementById("details-content");
    detailsContainer.innerHTML = templateHtmlRenderDetails(nextPokemon);
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












