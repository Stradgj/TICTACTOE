//highlighting HTML objects
const allGrids = document.querySelectorAll(".grid");
const field = document.querySelector(".field");
const playerButtons = document.querySelector(".player-field");
const difficultField = document.querySelector(".difficult-field");
const sideField = document.querySelector(".side-field");
const resetButton = document.querySelector(".btn-reset");
const stopButton = document.querySelector(".btn-stop");
const player1Button = document.querySelector(".btn1");
const player2Button = document.querySelector(".btn2");
const easyButton = document.querySelector(".easy");
const normalButton = document.querySelector(".normal");
const hardButton = document.querySelector(".hard");
const backToStart = document.querySelector(".back-to-start");
const backToDifficult = document.querySelector(".back-to-difficult");
const crossButton = document.querySelector(".crosses");
const zeroButton = document.querySelector(".zeros");
const header = document.querySelector("header");
const tittle = document.querySelector(".tittle");

//Defining variables
let difficult;
let side;
let currentPlayer = 0;
let movesCounter = 0;
let player1Grids = [];
let player2Grids = [];
let usedGrigs = [];
let gameStatus = 0;
let botMakeMovInterval;
const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

//Start the game
player1Button.addEventListener("click", function () {
  //Show the difficult field
  showDifficultField();
});
player2Button.addEventListener("click", function () {
  //Starting the game for 2 player
  gameStart();
});

//Show the difficult field
function showDifficultField() {
  playerButtons.style.display = "none";
  difficultField.style.display = "flex";
  sideField.style.display = "none";
  tittle.style.fontSize = "35px";
  tittle.textContent = "Choose the difficult";
}

//Show the side field
function showSideField() {
  playerButtons.style.display = "none";
  difficultField.style.display = "none";
  sideField.style.display = "flex";
  tittle.textContent = "Choose the side";
}

//Show the side field and set the difficult
easyButton.addEventListener("click", function () {
  showSideField();
  difficult = 0;
});
normalButton.addEventListener("click", function () {
  showSideField();
  difficult = 1;
});
hardButton.addEventListener("click", function () {
  showSideField();
  difficult = 2;
});

//Defining the side, and start the game
crossButton.addEventListener("click", function () {
  side = 0;
  gameStart(true);
  console.log(side);
});
zeroButton.addEventListener("click", function () {
  side = 1;
  gameStart(true);
  console.log(side);
});

//buttons, that back to previous condition
backToStart.addEventListener("click", startField);
backToDifficult.addEventListener("click", showDifficultField);

//function,that makes play field bigger
function bigField() {
  field.style.width = "500px";
  field.style.height = "500px";
  field.style.gridTemplateRows = "160px 160px 160px";
  field.style.gridTemplateColumns = "160px 160px 160px";
  field.style.gap = "10px";
}
//function,that returns play field to default
function defaultField() {
  field.style.width = "250px";
  field.style.height = "250px";
  field.style.gridTemplateRows = "80px 80px 80px";
  field.style.gridTemplateColumns = "80px 80px 80px";
  field.style.gap = "5px";
}
//function, that starts the game
function gameStart(bot = false) {
  //CSS changes
  bigField();
  sideField.style.display = "none";
  playerButtons.style.display = "flex";
  header.style.display = "none";
  player1Button.style.display = "none";
  player2Button.style.display = "none";
  stopButton.style.display = "block";
  //highlight cursor
  allGrids.forEach((grid) => (grid.style.cursor = "pointer"));
  //Change ability to make move
  allGrids.forEach(
    (grid) =>
      (grid.style.pointerEvents = side === 1 ? "none" : "visiblePainted")
  );
  //Add function to all grids
  allGrids.forEach((el) => el.addEventListener("click", action));
  //Bot make move
  if (bot === true) {
    botMakeMovInterval = setInterval(botMove, 0, allGrids, difficult);
  }
}
//bot logic
function botMove(grid, difficult) {
  //check if bot move
  if (currentPlayer !== side) {
    // easy difficult
    if (difficult === 0) {
      const i = Math.floor(Math.random() * grid.length);
      grid[i].click();
    }
    //normal difficult
    if (difficult === 1) {
    }
    // hard difficult
    if (difficult === 2) {
    }
  }
}

//Implementing grid functionality
function action() {
  //defining zeros anf crosses
  const zero = document.createElement("img");
  const cross = document.createElement("img");

  zero.src = "zero.png";
  cross.src = "cross.png";

  //Defining grid that was clicked
  const gridNum = Number(this.className.slice(-1));

  //Checking if this grid wasn't clicked
  if (!usedGrigs.some((el) => el === gridNum)) {
    //Stamp the cross
    if (currentPlayer === 0) {
      player1Grids.push(gridNum);
      this.appendChild(cross);
      //Stamp the zero
    } else {
      player2Grids.push(gridNum);
      this.appendChild(zero);
    }
    //increment movesCounter
    movesCounter++;

    moveBreaker();

    //changing player
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    //Adding used grid to array
    usedGrigs.push(gridNum);
    //turning off ability to click on used grid
    allGrids[gridNum].style.cursor = "default";
  }

  //Game logic
  if (player1Grids.length >= 3) {
    // If player has a 3 coincidences with win combination - he wins
    for (const combination of winCombinations) {
      let coincidences1 = 0;
      let coincidences2 = 0;
      combination.forEach(function (num) {
        if (player1Grids.includes(num)) coincidences1++;
        if (player2Grids.includes(num)) coincidences2++;
      });
      if (coincidences1 >= 3) gameStatus = 1;
      if (coincidences2 >= 3) gameStatus = 2;
    }
    //if there are 9 moves - nobody wins
    if (movesCounter === 9 && !gameStatus) gameStatus = 3;
  }

  gameResults(gameStatus);
}

//If bot make move - player cant click on grids
function moveBreaker() {
  allGrids.forEach(
    (grid) =>
      (grid.style.pointerEvents =
        currentPlayer === side ? "none" : "visiblePainted")
  );
}

//Set tweaks to default
function gameReset(newGame = true) {
  currentPlayer = 0;
  movesCounter = 0;
  player1Grids = [];
  player2Grids = [];
  usedGrigs = [];
  gameStatus = 0;
  allGrids.forEach((el) => (el.innerHTML = ""));
  resetButton.style.display = "none";
  moveBreaker();
  clearInterval(botMakeMovInterval);
  if (newGame) {
    gameStart(side === 0 || side === 1 ? true : false);
  }
}

//Changes for completed game
function completedGame() {
  resetButton.style.display = "block";
  allGrids.forEach((el) => el.removeEventListener("click", action));
  allGrids.forEach((grid) => (grid.style.cursor = "default"));
}

//function that display default display
function startField() {
  difficultField.style.display = "none";
  playerButtons.style.display = "flex";
  header.style.display = "block";
  tittle.textContent = "TICTACTOE";
  tittle.style.fontSize = "80px";
  player1Button.style.display = "block";
  player2Button.style.display = "block";
  stopButton.style.display = "none";
  resetButton.style.display = "none";
}

//function, that stops the game
function stop() {
  gameReset(false);
  startField();
  allGrids.forEach((grid) => (grid.style.cursor = "default"));
  allGrids.forEach((el) => el.removeEventListener("click", action));
  defaultField();
  clearInterval(botMakeMovInterval);
  side = undefined;
}

//stopping the game
stopButton.addEventListener("click", stop);
//resetting the game
resetButton.addEventListener("click", gameReset);

//display results
function headResult(result) {
  header.style.display = "block";
  tittle.style.fontSize = "40px";
  tittle.textContent = `${result}`;
}

function endTheGame(result) {
  headResult(result);
  completedGame();
}

//If game had ended
function gameResults(gameStatus) {
  if (gameStatus === 1) {
    //Crosses wins\
    endTheGame("CROSSES WON");
  }
  if (gameStatus === 2) {
    //Rings wins
    endTheGame("RINGS WON");
  }
  if (gameStatus === 3) {
    // DRAW
    endTheGame("DRAW");
  }
}
