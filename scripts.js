import { colors } from "./type-colors.js"



// Our index number for selecting which pokemon in the pokdex we are on
let indexNumber = 1;

// HTML buttons
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("previous");

// Button functions
// Also clearing Abilities HTML after index change
const buttonNext = () => {
    
    if (indexNumber <= 1117) {
        indexNumber++
    } 
    console.log(indexNumber)
    pokemonData()
}

nextBtn.addEventListener("click", buttonNext);


const buttonPrev = () => {
    if (indexNumber <= 0) {
        indexNumber = 0;
    } else {
        indexNumber--
    }
    console.log(indexNumber)
    pokemonData()
}

prevBtn.addEventListener("click", buttonPrev)


// Updating Pokemon Data, names, types etc.
const pokemonData = () => {
    
    // Declaring all necessary HTML elements 
    const pokemonName = document.getElementById("pokemonName");
    const pokemonNameJAP = document.getElementById("pokemonNameJAP");
    const pokemonNumber = document.getElementById("pokemonNumber");
    const pokemonSprite = document.getElementById("pokemonSprite");
    const type1 = document.getElementById("type1");
    const type2 = document.getElementById("type2");
    const pokedexEntry = document.getElementById("pokedexEntry");
    const pokedexEntryJAP = document.getElementById("pokedexEntryJAP");
    const pokemonStats = document.getElementById("pokemonStats");
    const pokemonMoves = document.getElementById("pokemonMoves");


    // Fetching API data and populating HTML elements
    fetch(`https://pokeapi.co/api/v2/pokemon/${indexNumber}`)
    .then (response => response.json())
    .then (data => {

        const cmToInches = Math.floor((data.height * 10) * 0.39)
        const inchesToFeet = cmToInches * 0.08

        pokemonName.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        pokemonNumber.textContent = `#${data.id}`;
            
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


        // Sprite changes 
        pokemonSprite.innerHTML = `
                <img 
                src="${data.sprites.other.home.front_default}" 
                /> `;


        // Pokemon Base Stats, mapping the data.stats array from the API and assigning the base_stat correctly

            const map1 = data.stats.map((x) => x)
            const HP = map1[0].base_stat
            const ATK = map1[1].base_stat
            const DEF = map1[2].base_stat
            const SPECIAL_ATK = map1[3].base_stat
            const SPECIAL_DEF = map1[4].base_stat
            const SPD = map1[5].base_stat
            const TOTAL = parseInt(HP) + parseInt(ATK) + parseInt(DEF) + parseInt(SPECIAL_ATK) + parseInt(SPECIAL_DEF) + parseInt(SPD)
            pokemonStats.innerHTML = `
                <li>HP: ${HP}</li>
                <li>ATK: ${ATK}</li>
                <li>DEF: ${DEF}</li>
                <li>SPECIAL ATK: ${SPECIAL_ATK}</li>
                <li>SPECIAL DEF: ${SPECIAL_DEF}</li>
                <li>SPD: ${SPD}</li>
                <li>TOTAL: ${TOTAL}</li>

                <li>Height: ${data.height * 10}cm (${inchesToFeet}ft)</li>
                <li>Weight: ${data.weight / 10}kg (${Math.floor((data.weight / 10)) * 2.25}lbs)</li>
            ` 
    // Pokemon Learned Moves:
        const map2 = data.moves.map((x) => x)
        pokemonMoves.innerHTML = ''; // Clear previous moves
        map2.forEach(element => {
            pokemonMoves.innerHTML += `
                <div>${element.move.name.toUpperCase()}</div>
                `
        });

    // Fetching API data for the pokedex entries
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${indexNumber}`)
        .then (response => response.json())
        .then (data => {
            

            // Finding specifically English entries
            const filter1 = data.flavor_text_entries.filter((x) => x.language.name === 'en')
            
            // Filtering for Omega RUBY 
            const filter2 = filter1.filter((x) => x.version.name === 'omega-ruby')
            
            // Adding them together
            const pokedexText = `${filter2[0].flavor_text}`
            // Updating pokedex text entry
            pokedexEntry.textContent = ""
            pokedexEntry.textContent = pokedexText

            // Filtering for JAP pokedex entries
            const filterJAP = data.flavor_text_entries.filter((x) => x.language.name === 'ja')
            const pokedexTextJAP = `${filterJAP[0].flavor_text}`

            pokedexEntryJAP.textContent = pokedexTextJAP

            const filterNameJAP = data.names.filter((x) => x.language.name === 'ja-Hrkt')
            pokemonNameJAP.textContent = `${filterNameJAP[0].name}` 

    })
})}

window.onload = pokemonData();
