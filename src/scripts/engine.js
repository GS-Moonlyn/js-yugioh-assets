const state ={
    score:{
        playerScore: 0,
        cpuScore: 0,
        scoreBox: document.getElementById("score-points")
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    playerSides:{
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        player2: "cpu-cards",
        player2Box: document.querySelector("#cpu-cards"),
    },    
    fieldCards:{
        player: document.getElementById("player-field-card"),
        cpu: document.getElementById("cpu-field-card"),
    },
    button: document.getElementById("next-duel"),
}

const pathImages = "./src/assets/icons/";

const playerSides = {
    player1: "player-cards",
    player2: "cpu-cards",
}

const cardData = [
    {
        id: 0,
        name: "Stardust Dragon",
        type: "Paper",
        img: `${pathImages}stardust.jpg`,
        Beats: [1],
        LosesTo: [2],
    },

    {
        id: 1,
        name: "Black Rose Dragon",
        type: "Rock",
        img: `${pathImages}blackrose.jpg`,
        Beats: [2],
        LosesTo: [0],
    },

    {
        id: 2,
        name: "Red Dragon Archfiend",
        type: "Scissors",
        img: `${pathImages}rda.jpg`,
        Beats: [0],
        LosesTo: [1],
    },
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1){
        cardImage.addEventListener("mouseover", ()=>{
            drawSelectedCard(idCard);
        })

        cardImage.addEventListener("click", () =>{
            setCardsField(cardImage.getAttribute("data-id"));
        })
    }

    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardImages();

    let cpuCardId = await getRandomCardId();

    await showFieldCards(true);

    await hideCardDetails();

    await drawFieldCards(cardId, cpuCardId);

    let duelResult = await checkDuelResult(cardId, cpuCardId);
    
    await updateScore();
    await drawButton(duelResult);
}

async function drawButton(text) {
    state.button.innerText = text;
    state.button.style.display = "block";
}

async function showFieldCards(value) {
    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.cpu.style.display = "block";
    } else {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.cpu.style.display = "none";
    }
}

async function drawFieldCards(cardId, cpuCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.cpu.src = cardData[cpuCardId].img;
}

async function hideCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Wins: ${state.score.playerScore} | Losses: ${state.score.cpuScore}`
}

async function checkDuelResult(playerCardId, cpuCardId) {
    let duelResult = "DRAW";
    let playerCard = cardData[playerCardId];
    
    if(playerCard.Beats.includes(cpuCardId)){
        duelResult = "WIN";
        state.score.playerScore++;
        await playAudio(duelResult);
    } 
    
    if (playerCard.LosesTo.includes(cpuCardId)){
        duelResult = "LOSE";
        state.score.cpuScore++;
        await playAudio(duelResult);
    } 
    
    return duelResult;
}

async function removeAllCardImages() {
    let {player1Box, player2Box} = state.playerSides;
    let imgElements = player1Box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player2Box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectedCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.cpu.style.display = "none";
    
    init();
}

async function playAudio(result) {
    const audio = new Audio(`./src/assets/audios/${result}.wav`);
    audio.volume = 0.8;
    audio.play();
}

function init() {
    showFieldCards(false);
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.player2);

    const bgm = document.getElementById("bgm");
    bgm.volume = 0.4;
    bgm.play();
}

init();