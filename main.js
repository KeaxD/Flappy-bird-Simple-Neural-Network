import * as character from "./character.js";
import * as clock from "./clock.js";
import { Obstacle } from "./obstacle.js";

// Access the canvas element using its ID
const canvas = document.getElementById("myCanvas");

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
let score;

function Jump() {
  characterPosY = +gapHeight;
}

function OffLimitsDetection() {
  if (characterPosY + characterHitBoxWidth >= screenLength) {
    gameIsOver = true;
  }
}

//Draw assets
function GenerateObstacle() {
  const newObstacle = new Obstacle(screenLength, gapHeight);
  obstacles.push(newObstacle);
}

//==========================================

function drawCanvas(startTime) {
  // Clear the entire canvas
  ctx.clearRect(0, 0, screenLength, screenLength);

  // Draw a hollow rectangle that takes the entire canvas
  ctx.strokeRect(0, 0, screenLength, screenLength);

  //Draw the clock
  clock.Draw(ctx, startTime);

  //Draw the Score
  ctx.font = "20px Georgia";
  ctx.strokeStyle = "black";
  ctx.strokeText("Your Score: " + score, screenLength - 200, 50);

  //Make the character fall with gravity and velocity
  velocity += gravity;
  characterPosY += velocity;

  //Draw Assets
  //Draw the character
  character.Draw(ctx, characterPosX, characterPosY, characterHitBoxWidth);

  //Draw Obstacles
  obstacles.forEach((obstacle, i) => {
    obstacle.update();
    obstacle.draw(ctx);

    // Remove obstacles that have moved off screen and add score
    if (obstacle.x + obstacle.pipeWidth < 0) {
      // Remove the object from the array
      obstacles.splice(i, 1);

      //Add to the score
      score += obstacle.score(characterPosX, characterHitBoxWidth);
    }

    if (
      obstacle.checkCollision(
        characterPosX,
        characterPosY,
        characterHitBoxWidth
      )
    ) {
      gameIsOver = true;
    }
  });

  //Draw the sensors
}

function Init() {
  // Reset game state
  obstacles = [];
  characterPosX = 100;
  characterPosY = 200;
  velocity = 0;
  gameIsOver = false;
  score = 0;
  // Start timer
  const startTime = new Date();

  // Initial draw of the canvas
  drawCanvas(startTime);

  // Update the canvas every 10 milliseconds
  gameLoopInterval = setInterval(() => {
    if (!gameIsOver) {
      drawCanvas(startTime);
      OffLimitsDetection();
    } else {
      clearInterval(gameLoopInterval);
    }
  }, 10);

  obstacleGenerationInterval = setInterval(() => {
    if (!gameIsOver) {
      GenerateObstacle();
    }
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
