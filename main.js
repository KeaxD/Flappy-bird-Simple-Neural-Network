// Access the canvas element using its ID
const canvas = document.getElementById("myCanvas");

const screenLength = canvas.height;
const pipeWidth = 100;

// Get the 2D drawing context from the canvas
const ctx = canvas.getContext("2d");

// Draw a hollow rectangle that takes the entire canvas
ctx.strokeRect(0, 0, screenLength, screenLength);

//Draw a bottom pipe
function DrawBottomPipe(posX, posY) {
  ctx.strokeStyle = "yellow";
  ctx.strokeRect(posX, screenLength - posY, pipeWidth, posY + 10);
}

//Draw a bottom pipe
function DrawTopPipe(posX, posY) {
  ctx.strokeStyle = "yellow";
  ctx.strokeRect(posX, 0, pipeWidth, posY);
}

//Use both functions to draw an obstacle
function DrawObstacle(posX, posY) {
  DrawBottomPipe(posX, posY);
  DrawTopPipe(posX, posY);
}

DrawObstacle(200, 300 - 80);
