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
    <div class="pokemon-card bg_${data.types[0].type.name}">
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
