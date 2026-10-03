const symbols = [
  "🐱", "🐰", "🧸", "🐶", "🐼", "🦊", "🐻", "🐨", "🐷",
  "🐸", "🐹", "🦁", "🐯", "🐵", "🦄", "🐑", "🦝", "🐧"
];

const gameCard = document.querySelector(".game-card");
const board = document.querySelector("#board");
const movesDisplay = document.querySelector("#moves");
const timeDisplay = document.querySelector("#time");
const pairsDisplay = document.querySelector("#pairs");
const progress = document.querySelector(".progress-track");
const progressFill = document.querySelector(".progress-fill");
const hint = document.querySelector("#game-hint");
const winMessage = document.querySelector("#win-message");
const winSummary = document.querySelector("#win-summary");
const sizeButtons = document.querySelectorAll(".size-button");

let pairCount = 8;
let moves = 0;
let matchedPairs = 0;
let firstCard = null;
let locked = false;
let startedAt = null;
let timerInterval = null;
let mismatchTimeout = null;
let gameActive = false;

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function updateTime() {
  const elapsed = Math.floor((Date.now() - startedAt) / 1000);
  timeDisplay.textContent = formatTime(elapsed);
}

function startTimer() {
  if (startedAt !== null) return;
  startedAt = Date.now();
  timerInterval = window.setInterval(updateTime, 1000);
}

function createCard(symbol, index) {
  const card = document.createElement("button");
  card.className = "card";
  card.type = "button";
  card.dataset.symbol = symbol;
  card.dataset.index = index;
  card.setAttribute("aria-label", `Card ${index + 1}, face down`);
  card.innerHTML = '<span class="card-face card-back" aria-hidden="true">🐾</span><span class="card-face card-front" aria-hidden="true"></span>';
  card.querySelector(".card-front").textContent = symbol;
  card.addEventListener("click", () => revealCard(card));
  return card;
}

function setCardState(card, state) {
  card.classList.toggle("is-revealed", state === "revealed");
  card.classList.toggle("is-matched", state === "matched");
  card.disabled = state === "matched";
  card.setAttribute(
    "aria-label",
    `Card ${Number(card.dataset.index) + 1}, ${state === "matched" ? `matched ${card.dataset.symbol}` : state === "revealed" ? card.dataset.symbol : "face down"}`
  );
}

function revealCard(card) {
  if (!gameActive || locked || card.classList.contains("is-revealed") || card.classList.contains("is-matched")) return;

  startTimer();
  setCardState(card, "revealed");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  moves += 1;
  movesDisplay.textContent = moves;

  if (firstCard.dataset.symbol === card.dataset.symbol) {
    setCardState(firstCard, "matched");
    setCardState(card, "matched");
    firstCard = null;
    matchedPairs += 1;
    updateProgress();

    if (matchedPairs === pairCount) finishGame();
    return;
  }

  locked = true;
  const previousCard = firstCard;
  firstCard = null;
  mismatchTimeout = window.setTimeout(() => {
    setCardState(previousCard, "hidden");
    setCardState(card, "hidden");
    locked = false;
    mismatchTimeout = null;
  }, 850);
}

function updateProgress() {
  pairsDisplay.textContent = `${matchedPairs} / ${pairCount}`;
  progress.setAttribute("aria-valuemax", pairCount);
  progress.setAttribute("aria-valuenow", matchedPairs);
  progressFill.style.width = `${(matchedPairs / pairCount) * 100}%`;
}

function finishGame() {
  window.clearInterval(timerInterval);
  timerInterval = null;
  updateTime();
  hint.textContent = "All pairs found — lovely work!";
  winSummary.textContent = `Finished in ${moves} moves and ${timeDisplay.textContent}.`;
  winMessage.hidden = false;
  document.querySelector("#play-again").focus();
}

function startNewGame() {
  window.clearInterval(timerInterval);
  window.clearTimeout(mismatchTimeout);
  timerInterval = null;
  mismatchTimeout = null;
  moves = 0;
  matchedPairs = 0;
  firstCard = null;
  locked = false;
  startedAt = null;
  movesDisplay.textContent = "0";
  timeDisplay.textContent = "00:00";
  pairsDisplay.textContent = `0 / ${pairCount}`;
  hint.textContent = `Find all ${pairCount} pairs to finish`;
  winMessage.hidden = true;
  board.replaceChildren();
  board.classList.toggle("is-large", pairCount === 18);
  board.setAttribute("aria-label", `Matching cards, ${pairCount * 2} cards`);
  progress.setAttribute("aria-valuemax", pairCount);
  progress.setAttribute("aria-valuenow", "0");
  progressFill.style.width = "0%";

  const deck = shuffle([...symbols.slice(0, pairCount), ...symbols.slice(0, pairCount)]);
  deck.forEach((symbol, index) => board.append(createCard(symbol, index)));
}

function startGame() {
  gameActive = true;
  gameCard.classList.add("is-fullscreen");
  document.body.classList.add("game-is-fullscreen");
  startNewGame();
  board.querySelector(".card").focus();
}

function exitGame() {
  gameActive = false;
  gameCard.classList.remove("is-fullscreen");
  document.body.classList.remove("game-is-fullscreen");
  startNewGame();
  document.querySelector("#play-game").focus();
}

sizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    pairCount = Number(button.dataset.pairs);
    sizeButtons.forEach((option) => {
      const selected = option === button;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    startNewGame();
  });
});

document.querySelector("#play-game").addEventListener("click", startGame);
document.querySelector("#restart-game").addEventListener("click", startNewGame);
document.querySelector("#exit-game").addEventListener("click", exitGame);
document.querySelector("#play-again").addEventListener("click", startNewGame);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && gameActive) exitGame();
});

startNewGame();
