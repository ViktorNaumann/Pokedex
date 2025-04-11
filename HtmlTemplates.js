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

// HTML-Template für die Pokémon-Details
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