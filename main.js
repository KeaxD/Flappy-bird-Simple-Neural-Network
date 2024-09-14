import { Character } from "./character.js";
import { Obstacle } from "./obstacle.js";

// Access the canvas element using its ID
const canvas = document.getElementById("myCanvas");
canvas.height = 600;
canvas.width = 600;
// Get the 2D drawing context from the canvas
const ctx = canvas.getContext("2d");
const screenLength = canvas.height;

let obstacles = [];

// Draw a hollow rectangle that takes the entire canvas

const characterHitBoxWidth = screenLength / 30;
const characterPosX = 100;
const characterPosY = 200;
const pipeWidth = 100;
const obstacleInterval = 2000;

//Instantiate character
let character = new Character(
  characterPosX,
  characterPosY,
  characterHitBoxWidth
);

const obstacle = new Obstacle(screenLength, characterHitBoxWidth, pipeWidth);
obstacles.push(obstacle);

//Instantiate Obstacles at a regular interval
let obstacleTimer = setInterval(() => {
  obstacles.push(new Obstacle(screenLength, characterHitBoxWidth, pipeWidth));
}, obstacleInterval);

function handleRestartEvent(event) {
  if (event.key === "r" || event.key === "R") {
    resetGame(); // Call the reset function when "R" is pressed
  }
}

// Add the event listener to the document
document.addEventListener("keydown", handleRestartEvent);

// Function to reset the game
function resetGame() {
  // Reset character
  character = new Character(characterPosX, characterPosY, characterHitBoxWidth);

  // Clear obstacles
  obstacles = [];

  // Reset obstacle interval
  clearInterval(obstacleTimer);

  obstacleTimer = setInterval(() => {
    obstacles.push(new Obstacle(screenLength, characterHitBoxWidth, pipeWidth));
  }, obstacleInterval);
}

function animate() {
  if (!character.damaged) {
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
    character.Update(obstacles, screenLength);

    //Draw Assets
    character.Draw(ctx);
  }
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
