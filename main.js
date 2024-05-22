import * as character from "./character.js";
import * as clock from "./clock.js";

// Access the canvas element using its ID
const canvas = document.getElementById("myCanvas");

const pipeWidth = 100;
// Get the 2D drawing context from the canvas
const ctx = canvas.getContext("2d");

const screenLength = canvas.height;
const characterHitBoxWidth = screenLength / 30;
const gapHeight = characterHitBoxWidth * 8;
let obstacles = [];
const obstacleInterval = 2000; // New obstacle every 2 seconds
let characterPosX = 100;
let characterPosY = 200;
let velocity = 0;
const gravity = 0.15;
let gameIsOver = false;
let gameLoopInterval;
let obstacleGenerationInterval;

//=======Functions=======

// Draw a bottom pipe
function DrawBottomPipe(posX, posY) {
  ctx.strokeStyle = "yellow";
  ctx.strokeRect(posX, screenLength - posY, pipeWidth, screenLength);
}

// Draw a top pipe
function DrawTopPipe(posX, height) {
  ctx.strokeStyle = "yellow";
  ctx.strokeRect(posX, 0, pipeWidth, height);
}

// Use both functions to draw an obstacle
function DrawObstacle(posX, heightVariance) {
  //make the bottom pipe the height variance
  const bottomPipeHeight = heightVariance;
  //Make the top pipe fill up the space left
  const topPipeHeight = screenLength - bottomPipeHeight - gapHeight;
  //Draw both pipe
  DrawBottomPipe(posX, bottomPipeHeight);
  DrawTopPipe(posX, topPipeHeight);
}

function GenerateObstacle() {
  //Get a random pipe height with a max height and a minimum of 40pixels
  const maxPipeHeight = screenLength - gapHeight - 40;
  const randHeight = Math.random() * maxPipeHeight + 80;

  //Push those variables in an array
  obstacles.push({
    x: screenLength,
    heightVariance: randHeight,
  });
}

function Jump() {
  characterPosY = +gapHeight;
}

function CollisionDetection(obstacle) {
  //Character's top and bottom Hitboxes
  let upperHitBox = characterPosY - characterHitBoxWidth;
  let lowerHitBox = characterPosY + characterHitBoxWidth;
  if (
    characterPosX + characterHitBoxWidth >= obstacle.x &&
    (lowerHitBox >= screenLength - obstacle.heightVariance ||
      upperHitBox <= screenLength - obstacle.heightVariance - gapHeight)
  ) {
    gameIsOver = true;
  }
}
//==========================================

function drawCanvas(startTime) {
  // Clear the entire canvas
  ctx.clearRect(0, 0, screenLength, screenLength);

  // Draw a hollow rectangle that takes the entire canvas
  ctx.strokeRect(0, 0, screenLength, screenLength);

  //Draw the clock
  clock.Draw(ctx, startTime);

  //Draw assets
  for (let i = 0; i < obstacles.length; i++) {
    // Move obstacle to the left
    obstacles[i].x -= 2;
    // Draw the obstacle at its new position
    DrawObstacle(obstacles[i].x, obstacles[i].heightVariance);

    //Clean up Obstacles as soon as it passes the bird's X coordinates
    if (
      obstacles.length > 0 &&
      obstacles[0].x + pipeWidth < characterPosX - characterHitBoxWidth
    ) {
      obstacles.shift();
    }

    //Check for collision
    CollisionDetection(obstacles[i]);
  }

  //Make the character fall with gravity and velocity
  velocity += gravity;
  characterPosY += velocity;
  character.Draw(ctx, characterPosX, characterPosY, characterHitBoxWidth);
}

function Init() {
  // Reset game state
  obstacles = [];
  characterPosX = 100;
  characterPosY = 200;
  velocity = 0;
  gameIsOver = false;
  // Start timer
  const startTime = new Date();

  // Initial draw of the canvas
  drawCanvas(startTime);

  // Update the canvas every 10 milliseconds
  gameLoopInterval = setInterval(() => {
    if (!gameIsOver) {
      drawCanvas(startTime);
    } else {
      clearInterval(gameLoopInterval);
    }
  }, 10);

  obstacleGenerationInterval = setInterval(() => {
    GenerateObstacle();
  }, obstacleInterval);
}

document.addEventListener("keydown", (e) => {
  if (e.keyCode === 82 && gameIsOver) {
    clearInterval(gameLoopInterval);
    clearInterval(obstacleGenerationInterval);
    Init();
  } else {
    velocity = -5;
  }
});

Init();
