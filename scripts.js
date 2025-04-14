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
        pokemonInformation.innerHTML = ""
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
        pokemonInformation.innerHTML = ""
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
    const pokemonType = document.getElementById("pokemonType");
    const pokedexEntry = document.getElementById("pokedexEntry");
    const pokedexEntryJAP = document.getElementById("pokedexEntryJAP");
    const pokemonStats = document.getElementById("pokemonBaseStats");
    const pokemonInformation = document.getElementById("pokemonInformation");
    const pokemonTrivia = document.getElementById("pokemonTrivia");


    // Fetching API data and populating HTML elements
    fetch(`https://pokeapi.co/api/v2/pokemon/${indexNumber}`)
    .then (response => response.json())
    .then (data => {
        pokemonName.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        pokemonNumber.textContent = `#${data.id}`;
        if (data.types.length > 1) {
            pokemonType.textContent = `
            ${data.types[0].type.name.charAt(0).toUpperCase()}${data.types[0].type.name.slice(1)} 
            ${data.types[1].type.name.charAt(0).toUpperCase()}${data.types[1].type.name.slice(1)}`
        } else {
            pokemonType.textContent = `${data.types[0].type.name.charAt(0).toUpperCase()}${data.types[0].type.name.slice(1)}`
        };

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
            `
            pokemonSprite.innerHTML = `
            <img 
                src="${data.sprites.other.home.front_default}"
            </img>
        `;

        // Pokemon trivia, Abilities; 
        const map2 = data.abilities.map((x) => x)
            map2.forEach(element => { 
            pokemonInformation.innerHTML += `
                <li>${element.ability.name.toUpperCase()}</li>
            `
        });

        pokemonTrivia.innerHTML = `
            <p>Height: ${data.height / 10}M</p>
            <p>Weight: ${data.weight / 10}kg (${Math.floor((data.weight /10) * 2.205)}lbs)</p>
        `

    // Fetching API data for the pokedex entries
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${indexNumber}`)
        .then (response => response.json())
        .then (data => {
            

            // Finding entries in the data.flavor_text_entries array that have the 'en' and 'ja' props
            const englishEntry = data.flavor_text_entries.find(entry => entry.language.name === 'en')
            const japName = data.names.find(name => name.language.name === 'ja')
            const japEntry = data.flavor_text_entries.find(entry => entry.language.name === 'ja')
      
            if (englishEntry) {
                pokedexEntry.textContent = englishEntry.flavor_text
            } 

            if (japEntry) {
                pokedexEntryJAP.textContent = japEntry.flavor_text
                pokemonNameJAP.textContent = `(${japName.name})`
            }
    })
})}

window.onload = pokemonData();
