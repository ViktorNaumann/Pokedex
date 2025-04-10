let allPokemonData = [];
let allPokemonName = [];

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
// HTML-Template für ein Pokémon
function templateHtmlRenderPokemon(data) {
  const animatedSprite =data.sprites.versions["generation-v"]["black-white"].animated.front_default;
  const defaultSprite = data.sprites.front_default;
  const sprite = animatedSprite || defaultSprite || "fallback-image-url.png"; // falls sogar das fehlt
  return /*html*/ `
    <div class="pokemon-card bg_${data.types[0].type.name}" onclick="showDetails(${data.id})">
      <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
      <img src="${sprite}">
      <p><strong>#${data.id}</strong></p>
      <p><strong>Typ: ${data.types.map((typeInfo) => typeInfo.type.name).join(", ")}</strong></p>
    </div>
`;
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
    return;
  }
  const data = await response.json();
  createCard(data);
  // Prüfen, ob speichern soll
  if (shouldSave) {
    const alreadyExists = allPokemonData.some(
      (pokemon) => pokemon.id === data.id
    );
    if (!alreadyExists) {
      allPokemonData.push(data);
    }
  }
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
    await getPokemon(pokemon, false); // <- Wichtig: Nicht speichern!
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
  const pokemon = allPokemonData.find((pokemon) => pokemon.id === pokemonId);
  if (!pokemon) {
    alert("Pokémon nicht gefunden!");
    return;
  }
  const detailsContainer = document.getElementById("details-content");
  detailsContainer.innerHTML = templateHtmlRenderDetails(pokemon);
  const overlay = document.getElementById("pokemon-details");
  overlay.classList.remove("hidden");
  document.body.classList.add("no-scroll"); // ⬅️ Scroll deaktivieren
}

function templateHtmlRenderDetails(pokemon) {
  const abilities = pokemon.abilities.map((ability) => ability.ability.name).join(", ");
  const types = pokemon.types.map((type) => type.type.name).join(", ");
  const primaryType = pokemon.types[0].type.name;

  const stats = pokemon.stats.map(stat => `
    <div class="stat">
      <span>${stat.stat.name.toUpperCase()}</span>
      <div class="stat-bar">
        <div class="stat-bar-fill" style="width: ${stat.base_stat}px;"></div>
      </div>
      <span>${stat.base_stat}</span>
    </div>
  `).join("");

  return /*html*/ `
    <div class="details-card">
      <div class="arrow left-arrow" onclick="showPreviousPokemon(${pokemon.id})">&#8592;</div>

      <div class="details-header bg_${primaryType}">
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <img src="${pokemon.sprites.front_default}">
        <p><strong>#${pokemon.id}</strong></p>
      </div>

      <div class="details-content">
        <div class="tabs">
          <button onclick="showTab('about')">About</button>
          <button onclick="showTab('stats')">Base Stats</button>
        </div>
        <div id="about-tab" class="tab-content">
          <p><strong>Typ:</strong> ${types}</p>
          <p><strong>Fähigkeiten:</strong> ${abilities}</p>
          <p><strong>Größe:</strong> ${pokemon.height / 10} m</p>
          <p><strong>Gewicht:</strong> ${pokemon.weight / 10} kg</p>
        </div>
        <div id="stats-tab" class="tab-content hidden">
          ${stats}
        </div>
      </div>

      <div class="arrow right-arrow" onclick="showNextPokemon(${pokemon.id})">&#8594;</div>
    </div>
  `;
}

function closeDetails() {
  const overlay = document.getElementById("pokemon-details");
  overlay.classList.add("hidden");
  document.body.classList.remove("fixed-position");
  document.body.classList.remove("no-scroll");
  window.scrollTo(0, scrollPosition);
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












