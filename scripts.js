import { colors } from "./type-colors.js"
import sprites from "./sprites.js"

// Our index number for selecting which pokemon in the pokdex we are on
let indexNumber = 1;

// HTML buttons
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("previous");

// Next Button  
nextBtn.addEventListener("click", () => {
    if (indexNumber < 1025) {
        indexNumber++
} 
    updatePokemonInfo()
    updatePokedexEntry()
});

// Previous Button
prevBtn.addEventListener("click", () => {
    if (indexNumber > 1) {
        indexNumber--
} 
    updatePokemonInfo()
    updatePokedexEntry()

});

// Update Pokémon Information function
const updatePokemonInfo = async () => {
    try {
        const dataCall = await fetch(`https://pokeapi.co/api/v2/pokemon/${indexNumber}`)
        const mainData = await dataCall.json()

        // Updating Pokémon Number, Types and Sprite
        const pokemonSprite = document.getElementById("pokemonSprite");
        pokemonSprite.innerHTML = `<img src="${mainData.sprites.other.home.front_default}" />`
        pokemonSprite.style.filter = `drop-shadow(0 0 1em ${colors[mainData.types[0].type.name]})`

        const type1 = document.getElementById("type1");
        const type2 = document.getElementById("type2");    
        if (mainData.types.length > 1) {
            type1.textContent = `${mainData.types[0].type.name.charAt(0).toUpperCase()}${mainData.types[0].type.name.slice(1)}`
            type2.textContent = `${mainData.types[1].type.name.charAt(0).toUpperCase()}${mainData.types[1].type.name.slice(1)}`
            type1.style.backgroundColor = colors[mainData.types[0].type.name]
            type1.style.filter = `drop-shadow(0 0 0.5em ${colors[mainData.types[0].type.name]})`
            type2.style.backgroundColor = colors[mainData.types[1].type.name]
            type2.style.filter = `drop-shadow(0 0 0.5em ${colors[mainData.types[1].type.name]})`

        } else {
             // If data.types returns only 1 type, clear type2 elements 
            type1.textContent = `${mainData.types[0].type.name.charAt(0).toUpperCase()}${mainData.types[0].type.name.slice(1)}`
            type2.textContent = ""
            type1.style.backgroundColor = colors[mainData.types[0].type.name]
            type1.style.filter = `drop-shadow(0 0 0.5em ${colors[mainData.types[0].type.name]})`
            type2.style.backgroundColor = ``
            type2.style.filter = ``
        };
    } catch (error) {
        console.log("updatePokemonInfo ERROR", error)
        }
} 

// Update Pokédex Entry function
const updatePokedexEntry = async () => {
    try {
        const dataCall = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${indexNumber}`)
        const pokedexData = await dataCall.json()

        // Updating Pokémon name
        const pokemonName = document.getElementById("pokemonName");
        pokemonName.textContent = pokedexData.names.filter((x) => x.language.name === 'en')[0].name

        const pokemonNumber = document.getElementById("pokemonNumber");
        pokemonNumber.textContent = "#" + pokedexData.id

        // Finding specifically English Omega Ruby Pokédex entries
        const filter1 = pokedexData.flavor_text_entries.filter((x) => x.language.name === 'en').filter((x) => x.version.name === 'omega-ruby')
        // Updating Pokédex entry
        const pokedexEntry = document.getElementById("pokedexEntry");
        pokedexEntry.textContent = `${filter1[0].flavor_text}`

        // Filtering for japanese pokedex entries
        const pokedexEntryJAP = document.getElementById("pokedexEntryJAP");
        pokedexEntryJAP.textContent = pokedexData.flavor_text_entries.filter((x) => x.language.name === 'ja')[0].flavor_text

        // Filtering for Japanese Pokémon names
        const pokemonNameJAP = document.getElementById("pokemonNameJAP");
        pokemonNameJAP.textContent = pokedexData.names.filter((x) => x.language.name === 'ja-Hrkt')[0].name

         /* Abilities: 
        if (pokedexData.abitlites.length > 1) {
            abilityName.innerHTML = `
            ${pokedexData.abitlites[0].name}
            ${pokedexData.abilities[1].name}
            `
        } else {
            abilityName.innerHTMl = `${pokedexData.abilities[0].name}` 
        } */

    } catch (error) {
        console.log("updatePokedexEntry ERROR", error)
    }
}

// Fetching Gen1 Pokémon Sprites for the background scroll animation (Very Costly)
 /* const backgroundSprites = document.getElementById("background");
const background = async () => {
    try {
        const gen1Data = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`)
        const data = await gen1Data.json()

        for(const element of data.results) {
            const dataCall = await fetch(`${element.url}`);
            const pokemonSprites = await dataCall.json();
            backgroundSprites.innerHTML += `<img loading="lazy" src="${pokemonSprites.sprites.other.home.front_default}" />`
        } 

       
    } catch (error) {
        console.error(error)
    }
} */

const background = () => {
    const backgroundSprites = document.getElementById("background");
    for(let i = 0; i < sprites.length; i++) {
        backgroundSprites.innerHTML += `<img loading="lazy" src="img/sprites/${sprites[i]}"/>` 
        console.log(sprites[i])
    }
    
}

// On window load start pokemonData() to load pokemon information, and begin background animation with background()
window.onload = () => {updatePokemonInfo(), updatePokedexEntry(), background()};


