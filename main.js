import * as character from "./character.js";

// Access the canvas element using its ID
const canvas = document.getElementById("myCanvas");

const pipeWidth = 100;
// Get the 2D drawing context from the canvas
const ctx = canvas.getContext("2d");

const screenLength = canvas.height;

function drawCanvas(startTime) {
  // Clear the entire canvas
  ctx.clearRect(0, 0, screenLength, screenLength);

  // Draw a hollow rectangle that takes the entire canvas
  ctx.strokeRect(0, 0, screenLength, screenLength);

  const elapsedTime = updateTime(startTime);

  ctx.font = "20px Georgia";
  ctx.strokeStyle = "black";
  ctx.strokeText("Elapsed Time: " + elapsedTime, 10, 50);

  DrawObstacle(200, 200);
  character.Draw(ctx, 100, 200);
}

// Draw a bottom pipe
function DrawBottomPipe(posX, posY) {
  ctx.strokeStyle = "yellow";
  ctx.strokeRect(posX, screenLength - posY, pipeWidth, posY + 10);
}

// Draw a top pipe
function DrawTopPipe(posX, posY) {
  ctx.strokeStyle = "yellow";
  ctx.strokeRect(posX, 0, pipeWidth, posY);
}

// Use both functions to draw an obstacle
function DrawObstacle(posX, posY) {
  DrawBottomPipe(posX, posY);
  DrawTopPipe(posX, posY);
}

// Function to calculate and format elapsed time
function updateTime(startTime) {
  const currentTime = new Date();
  const elapsedTime = currentTime - startTime;

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

  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

function Init() {
  // Start timer
  const startTime = new Date();

  // Initial draw of the canvas
  drawCanvas(startTime);

  // Update the canvas every 10 milliseconds
  setInterval(() => drawCanvas(startTime), 10);
}

Init();
