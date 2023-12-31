const state = {
    view: {
        ScoreView: document.getElementById("score-points"),
        imgPokemon: document.getElementById("pokemon-img"),
        namePokemon: document.getElementById("pokemon-name"),
        typePokemon: document.getElementById("pokemon-type")
    },
    values: {
        scorePlayer: 0,
        scoreEnemy: 0,
    },
    battle: {
        player: document.getElementById("player-field-pokemon"),
        enemy: document.getElementById("enemy-field-pokemon")
    },
    button: document.getElementById("fight"),
};

const playersSides = {
    player: "pokeballs-player",
    enemy: "pokeballs-enemy"
}

const imgPath = "./assets/img/Pokemons/"

const Pokedex = [
    {
        id: 0,
        name: "Charmander",
        type: "FIRE",
        img: `${imgPath}charmander.png`,
        Win: ['GRASS'],
        Lose: ['WATER']
    },
    {
        id: 1,
        name: "Bulbasaur",
        type: "GRASS",
        img: `${imgPath}bulbasaur.png`,
        Win: ['WATER'],
        Lose: ['FIRE']
    },
    {
        id: 2,
        name: "Squirtle",
        type: "WATER",
        img: `${imgPath}squirtle.png`,
        Win: ['FIRE'],
        Lose: ['GRASS']
    },
]

async function getRandomId() {
    const random = Math.floor(Math.random() * Pokedex.length);
    return Pokedex[random].id;
}

async function cratePokeImg(Idpokemon, fieldSide) {
    const PokemonImage = document.createElement("img");
    PokemonImage.setAttribute("height", "150px");
    PokemonImage.setAttribute("src", "./assets/img/1.png");
    PokemonImage.setAttribute("data-id", Idpokemon);

    if (fieldSide === playersSides.player) {
        PokemonImage.classList.add("Pokestyle");

        PokemonImage.addEventListener("click", () => {
            setPokemonField(PokemonImage.getAttribute("data-id"));
        });

        PokemonImage.addEventListener("mouseover", () => {
            catchSelectPokeball(Idpokemon);
        });
    }

    return PokemonImage;
}

async function removeAllPokemons() {
    let pokemonPlayer = document.querySelector("#pokeballs-player");
    let imgElementsP = pokemonPlayer.querySelectorAll("img");
    imgElementsP.forEach((img) => img.remove());

    let pokemonEnemy = document.querySelector("#pokeballs-enemy");
    let imgElementsE = pokemonEnemy.querySelectorAll("img");
    imgElementsE.forEach((img) => img.remove());
}

async function catchSelectPokeball(Idpokemon) {
    state.view.imgPokemon.src = Pokedex[Idpokemon].img;
    state.view.namePokemon.innerText = Pokedex[Idpokemon].name;
    state.view.typePokemon.innerText = "Attribute: " + Pokedex[Idpokemon].type
}

async function setPokemonField(Idpokemon) {
    await removeAllPokemons();
    let enemyId = await getRandomId();

    state.battle.player.style.display = "block";
    state.battle.enemy.style.display = "block";

    state.battle.player.src = Pokedex[Idpokemon].img;
    state.battle.enemy.src = Pokedex[enemyId].img;

    let resultTotal = await ResultDuel(Idpokemon, enemyId);

    await UpdateScore();
    await catchButton(resultTotal);

}

async function ResultDuel(IdPokemon, enemyId) {
    let result = "Empate";
    let playerPokemon = Pokedex[IdPokemon]
    let enemyPokemon = Pokedex[enemyId].type;
  
    if (playerPokemon.Win.includes(enemyPokemon)) {
        result = "Você venceu!"
        state.values.scorePlayer++;
        await playAudio("win");
    }
    if (playerPokemon.Lose.includes(enemyPokemon)) {
        result = "Você Perdeu!"
        state.values.scoreEnemy++;
        await playAudio("lose");

    }
    
    return result;
}

async function catchButton(resultTotal) {
    state.button.innerText = resultTotal
    state.button.style.display = "block";
}
async function UpdateScore() {
    state.view.ScoreView.innerText = `Vitorias: ${state.values.scorePlayer} - Derrotas: ${state.values.scoreEnemy}`
}
async function catchPokeballs(numberPk, fieldSide) {

    state.battle.player.style.display = "none";
    state.battle.enemy.style.display = "none";

    for (var i = 0; i < numberPk; i++) {
        const Idpokemon = await getRandomId();
        const pokeImg = await cratePokeImg(Idpokemon, fieldSide);

        document.getElementById(fieldSide).appendChild(pokeImg);
    }
}

async function resetFight(){
    state.view.imgPokemon.src = "";
    state.view.namePokemon.innerText = "Selecione uma";
    state.view.typePokemon.innerText = "das suas pokebolas";
    state.button.style.display = "none";

    state.battle.player.style.display = "none";
    state.battle.enemy.style.display = "none";

    Start();
    
}

async function playAudio(status){
 audio = new Audio(`./assets/audio/${status}.mp3`)
 audio.play();
}




function Start() {
  
    catchPokeballs(5, playersSides.player);
    catchPokeballs(5, playersSides.enemy);
}
Start();