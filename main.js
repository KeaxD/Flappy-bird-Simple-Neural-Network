import { Character } from "./character.js";
import { Obstacle } from "./obstacle.js";

// Access the canvas element using its ID
const canvas = document.getElementById("myCanvas");
canvas.height = 600;
canvas.width = 600;
// Get the 2D drawing context from the canvas
const ctx = canvas.getContext("2d");
const screenLength = canvas.height;

const obstacles = [];

// Draw a hollow rectangle that takes the entire canvas

const characterHitBoxWidth = screenLength / 30;
const characterPosX = 100;
const characterPosY = 200;
const pipeWidth = 100;
const obstacleInterval = 2000;

//Instantiate character
const character = new Character(
  characterPosX,
  characterPosY,
  characterHitBoxWidth
);

const obstacle = new Obstacle(screenLength, characterHitBoxWidth, pipeWidth);
obstacles.push(obstacle);

//Instantiate Obstacles at a regular interval
setInterval(() => {
  obstacles.push(new Obstacle(screenLength, characterHitBoxWidth, pipeWidth));
}, obstacleInterval);

function animate() {
  //Redraw the Canvas
  canvas.height = 600;
  canvas.width = 600;
  ctx.strokeRect(0, 0, screenLength, screenLength);

  // Update and draw each obstacle
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obstacle = obstacles[i];
    obstacle.Update();
    obstacle.Draw(ctx);

    // Remove off-screen obstacles
    if (obstacle.isOffScreen()) {
      obstacles.splice(i, 1);
    }
  }

  //Update the character position
  character.Update(obstacles);

  //Draw Assets

  character.Draw(ctx);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
