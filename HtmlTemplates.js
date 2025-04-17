function templateHtmlRenderPokemon(data) {
    const animatedSprite =data.sprites.versions["generation-v"]["black-white"].animated.front_default;
    const defaultSprite = data.sprites.front_default;
    const sprite = animatedSprite || defaultSprite || "fallback-image-url.png";
    return /*html*/ `
      <div class="pokemon-card bg_${data.types[0].type.name}" onclick="showDetails(${data.id})">
        <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
        <img src="${sprite}">
        <p><strong>#${data.id}</strong></p>
        <p><strong>Type: ${data.types.map((typeInfo) => typeInfo.type.name).join(", ")}</strong></p>
      </div>
  `;
  }

function templateHtmlRenderDetails(pokemon, allData) {
    const abilities = pokemon.abilities.map((ability) => ability.ability.name).join(", ");
    const types = pokemon.types.map((type) => type.type.name).join(", ");
    const primaryType = pokemon.types[0].type.name;
    const isFirst = pokemon.id === allData[0].id;
    const isLast = pokemon.id === allData[allData.length - 1].id;
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
            <p><strong>Type:</strong> ${types}</p>
            <p><strong>Abilities:</strong> ${abilities}</p>
            <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
            <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
          </div>
          <div id="stats-tab" class="tab-content hidden">
            ${stats}
          </div>
        </div>
        <div class="details-nav">
          <div class="arrow left-arrow${isFirst ? " hidden" : ""}" onclick="showPreviousPokemon(${pokemon.id})">&#8592;</div>
          <div class="arrow right-arrow${isLast ? " hidden" : ""}" onclick="showNextPokemon(${pokemon.id})">&#8594;</div>
        </div>
      </div>
    `;
  }