import * as character from "./character.js";

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
const difficultyFactor = 5;

//=======Functions=======

// Draw a bottom pipe
function DrawBottomPipe(posX, posY, height) {
  ctx.strokeStyle = "yellow";
  ctx.strokeRect(posX, screenLength - posY - height, pipeWidth, height);
}

// Draw a top pipe
function DrawTopPipe(posX, posY, height) {
  ctx.strokeStyle = "yellow";
  ctx.strokeRect(posX, 0, pipeWidth, height);
}

// Use both functions to draw an obstacle
function DrawObstacle(posX, posY, heightVariance) {
  const bottomPipeHeight = posY + Math.floor(heightVariance);
  const topPipeHeight = screenLength - bottomPipeHeight - gapHeight;

  DrawBottomPipe(posX, 0, bottomPipeHeight);
  DrawTopPipe(posX, screenLength - topPipeHeight, topPipeHeight);
}

// Function to calculate and format elapsed time
function GetTime(startTime) {
  const currentTime = new Date();
  const elapsedTime = currentTime - startTime;

  return elapsedTime;
}

function GenerateObstacle() {
  //Get the height of one pipe
  const pipeHeight = screenLength / 2 - gapHeight;

  //Get the height variance of a pipe
  const heightVariance = (Math.random() * 2 - 1) * (pipeHeight / 2);

  //Set the pipe to reach the middle
  const posY = screenLength / 2;

  //Push those variables in an array
  obstacles.push({
    x: screenLength,
    height: posY,
    heightVariance: heightVariance,
  });
}

function Jump() {
  const jumpHeight = gapHeight;
  characterPosX = +gapHeight;
}
//==========================================

function drawCanvas(startTime) {
  // Clear the entire canvas
  ctx.clearRect(0, 0, screenLength, screenLength);

  // Draw a hollow rectangle that takes the entire canvas
  ctx.strokeRect(0, 0, screenLength, screenLength);

  const elapsedTime = GetTime(startTime);

  const hours = Math.floor(elapsedTime / 3600000)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((elapsedTime % 3600000) / 60000)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((elapsedTime % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  const milliseconds = (elapsedTime % 1000).toString().padStart(3, "0");

  var formattedTime = `${hours}:${minutes}:${seconds}:${milliseconds}`;

  const speed = elapsedTime / difficultyFactor;

  ctx.font = "20px Georgia";
  ctx.strokeStyle = "black";
  ctx.strokeText("Elapsed Time: " + formattedTime, 10, 50);

  //Draw assets
  for (let i = 0; i < obstacles.length; i++) {
    // Move obstacle to the left
    obstacles[i].x -= 2;
    // Draw the obstacle at its new position
    DrawObstacle(
      obstacles[i].x,
      obstacles[i].height,
      obstacles[i].heightVariance
    );
  }

  //Clean up Obstacles
  if (obstacles.length > 0 && obstacles[0].x + pipeWidth < 0) {
    obstacles.shift();
  }

  //Make the character fall with gravity and velocity
  velocity += gravity;
  characterPosY += velocity;
  character.Draw(ctx, characterPosX, characterPosY, characterHitBoxWidth);
}

function Init() {
  // Start timer
  const startTime = new Date();

  // Initial draw of the canvas
  drawCanvas(startTime);

  // Update the canvas every 10 milliseconds
  setInterval(() => drawCanvas(startTime), 10);

  setInterval(() => {
    GenerateObstacle();
  }, obstacleInterval);
}

document.addEventListener("keydown", () => {
  velocity = -5;
});

Init();
