import { Character } from "./character.js";
import { Obstacle } from "./obstacle.js";

// Access the canvas element using its ID
const Gamecanvas = document.getElementById("myCanvas");
Gamecanvas.height = 600;
Gamecanvas.width = 600;
// Get the 2D drawing context from the canvas
const ctx = Gamecanvas.getContext("2d");
const screenLength = Gamecanvas.height;

//Access the network canvas
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.height = 600;
networkCanvas.width = 600;

const netctx = networkCanvas.getContext("2d");

let obstacles = [];
let score = 0;

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

  //Reset score
  score = 0;

  // Reset obstacle interval
  clearInterval(obstacleTimer);

  obstacleTimer = setInterval(() => {
    obstacles.push(new Obstacle(screenLength, characterHitBoxWidth, pipeWidth));
  }, obstacleInterval);
}

function animate() {
  if (!character.damaged) {
    //Redraw the Canvas
    Gamecanvas.height = 600;
    Gamecanvas.width = 600;
    ctx.strokeRect(0, 0, screenLength, screenLength);

    // Update and draw each obstacle
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obstacle = obstacles[i];
      obstacle.Update();
      obstacle.Draw(ctx);

      //Count Score
      score += obstacle.score(character.x);
      // Remove off-screen obstacles
      if (obstacle.isOffScreen()) {
        obstacles.splice(i, 1);
      }
    }

    //Update the character position
    character.Update(obstacles, screenLength);

    //Draw Assets
    character.Draw(ctx);

    // Draw Score
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
  }
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
