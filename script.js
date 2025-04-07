function init() {
  getData();
}

async function getData() {
  const pokemonList = document.getElementById('pokemon-list');

  for (let i = 1; i <= 20; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    const response = await fetch(url);
    const data = await response.json();

    pokemonList.innerHTML += templateHtmlRenderPokemon(data);
  }
}

function templateHtmlRenderPokemon(data) {
  return /*html*/`
    <div class="pokemon-card">
      <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <p><strong>#${data.id}</strong></p>
      <p>Typ: ${data.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
    </div>
  `;
}

