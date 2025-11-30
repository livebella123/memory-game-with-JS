const icons = ["🍎","🚀","🎧","🐱","⚽","🌙","🔥","🎲"];
const cards = [];

let firstCard = null;
let lock = false;
let moves = 0;
let time = 0;
let timerInterval = null;

const best = localStorage.getItem("bestItem");

if(best) document.getElementById("best").textContent = best;

function startTimer() {
    if(timerInterval) return;
    timerInterval = setInterval(() => {
        time++;
        document.getElementById("time").textContent = time;
    }, 1000);
}

function createGame() {
    const game = document.getElementById("game");
    game.innerHTML = "";

    const deck = [...icons, ...icons].sort(() => Math.random() - 0.5);

    deck.forEach(icon => {
        const card = document.createElement("div");

        card.className = "card";
        card.innerHTML = `
          <div class="inner">
            <div class="face front">${icon}</div>
            <div class="face back"></div>
          </div>`;
        card.dataset.icon = icon;
        
        card.addEventListener("click", () => flipCard(card));
        game.appendChild(card);
    });

    cards = document.querySelectorAll(".card");
}

function flipCard(card) {
    startTimer();

    if(lock || card.classList.contains("matched") || card === firstCard) return;

    card.classList.add("flipped");
    
    if(!firstCard) {
        firstCard = card;
    } else {
        moves++;
        document.getElementById("moves").textContent = moves;

        if(firstCard.dataset.icon === card.dataset.icon) {
            firstCard.classList.add("matched");
            card.classList.add("matched");
            firstCard = null;
            checkWin();
        } else {
            lock = true;
            setTimeout(() => {
                firstCard.classList.remove("flipped");
                card.classList.remove("flipped");
                firstCard = null;
                lock = false;
            }, 1000);
        }
    }
}

function checkWin() {
    if([...cards].every(card => card.classList.contains("matched"))) {
        clearInterval(timerInterval);

        const winText = document.getElementById("win");

        winText.textContent = `Hai vinto! Tempo: ${time}s | Mosse: ${moves}`;
        winText.style.display = "block";

        const best = localStorage.getItem("bestTime");
        if(!best || time < best) {
            localStorage.setItem("bestTime", time);
            document.getElementById("best").textContent = time;
        }
    }
}

function restart() {
    clearInterval(timerInterval);
    timerInterval = null;
    firstCard = null;
    lock = false;
    moves = 0;
    time = 0;

    document.getElementById("time").textContent = 0;
    document.getElementById("moves").textContent = 0;
    document.getElementById("win").style.display = "none";

    createGame();
}

createGame();