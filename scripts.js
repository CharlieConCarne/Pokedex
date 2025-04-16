import { colors } from "./type-colors.js"

// Our index number for selecting which pokemon in the pokdex we are on
let indexNumber = 1;

// HTML buttons
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("previous");

// Next Button
const buttonNext = () => {
    
    if (indexNumber <= 1025) {
        indexNumber++

    } 
    pokemonData()
}   

nextBtn.addEventListener("click", buttonNext);

// Previous Button
const buttonPrev = () => {
    if (indexNumber <= 0) {
        indexNumber = 0;
    } else {
        indexNumber--

    }
    pokemonData()
}

prevBtn.addEventListener("click", buttonPrev)


// Updating Pokemon Data, names, types etc.
const pokemonData = () => {
    
    // Declaring all necessary HTML elements 
    const pokemonName = document.getElementById("pokemonName");
    const pokemonNameJAP = document.getElementById("pokemonNameJAP");
    const pokemonSprite = document.getElementById("pokemonSprite");
    const type1 = document.getElementById("type1");
    const type2 = document.getElementById("type2");
    const pokedexEntry = document.getElementById("pokedexEntry");
    const pokedexEntryJAP = document.getElementById("pokedexEntryJAP");
    
    // Fetching API data and populating HTML elements
    fetch(`https://pokeapi.co/api/v2/pokemon/${indexNumber}`)
    .then (response => response.json())
    .then (data => {
        
        // Updating pokemonName element
        pokemonName.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        pokemonNumber.textContent = `#${data.id}`;
           
        // Updating Types to match colors from type-colors for multi-type Pokémon
        if (data.types.length > 1) {
            type1.textContent = `${data.types[0].type.name.charAt(0).toUpperCase()}${data.types[0].type.name.slice(1)}`
            type2.textContent = `${data.types[1].type.name.charAt(0).toUpperCase()}${data.types[1].type.name.slice(1)}`
            type1.style.backgroundColor = colors[data.types[0].type.name]
            type1.style.filter = `drop-shadow(0 0 0.5em ${colors[data.types[0].type.name]})`
            type2.style.backgroundColor = colors[data.types[1].type.name]
            type2.style.filter = `drop-shadow(0 0 0.5em ${colors[data.types[1].type.name]})`

        } else {

            // If data.types returns only 1 type, clear type2 elements 
            type1.textContent = `${data.types[0].type.name.charAt(0).toUpperCase()}${data.types[0].type.name.slice(1)}`
            type2.textContent = ""
            type1.style.backgroundColor = colors[data.types[0].type.name]
            type1.style.filter = `drop-shadow(0 0 0.5em ${colors[data.types[0].type.name]})`
            type2.style.backgroundColor = ``
            type2.style.filter = ``



        };
     
        // Sprite Updates for next pokemon being displayed 
        pokemonSprite.innerHTML = `
                <img src="${data.sprites.other.home.front_default}" />`

        pokemonSprite.style.filter = `drop-shadow(0 0 1em ${colors[data.types[0].type.name]})`

        // Fetching API data for the pokedex entries
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${indexNumber}`)
        .then (response => response.json())
        .then (data => {
            
            // Finding specifically English entries
            const filter1 = data.flavor_text_entries.filter((x) => x.language.name === 'en')
            
            // Filtering for Omega RUBY entries and defining the Text
            const filter2 = filter1.filter((x) => x.version.name === 'omega-ruby')
            const pokedexText = `${filter2[0].flavor_text}`

            // Updating pokedex text entry
            pokedexEntry.textContent = ""
            pokedexEntry.textContent = pokedexText 

            // Filtering for japanese pokedex entries
            const filterJAP = data.flavor_text_entries.filter((x) => x.language.name === 'ja')
            const pokedexTextJAP = `${filterJAP[0].flavor_text}`

            // Updating Japanese pokedex entry
            pokedexEntryJAP.textContent = pokedexTextJAP

            // Filtering for Japanese Pokémon names
            const filterNameJAP = data.names.filter((x) => x.language.name === 'ja-Hrkt')

            // Updating Japanese Pokémon name
            pokemonNameJAP.textContent = `${filterNameJAP[0].name}` 

    })

})};


// Fetching sprites for every Pokémon for the background scroll animation (Very Costly)

const backgroundSprites = document.getElementById("background");

const background = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=386`)
    .then (response => response.json())
    .then (data => {
        const map1 = data.results.map((x) => x)
        map1.forEach(element => {
            fetch(`${element.url}`)
            .then (response => response.json())
            .then (data => {
                backgroundSprites.innerHTML += `
                <img src="${data.sprites.other.home.front_default}" />
            `
            })
        });
    })
}

// On window load start pokemonData() to load pokemon information, and begin background animation with background()
window.onload = pokemonData(), background();
