import { Character } from "./character.js";
import { NeuralNetwork } from "./network.js";
import { Obstacle } from "./obstacle.js";
import { Visualizer } from "./Visualizer.js";

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
const N = 100;
let birds = generateBirds(N);

let bestBird = birds[0]; //default to the first one

let allDamaged;

let bestDistance = 0;
let previousBest = 0;

//If saved in local storage, get that brain
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < birds.length; i++) {
    birds[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(birds[i].brain, 0.1);
    }
  }
}

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
  birds = generateBirds(N);

  // Clear obstacles
  obstacles = [];

  //Reset score
  score = 0;

  // Reset obstacle interval
  clearInterval(obstacleTimer);

  obstacleTimer = setInterval(() => {
    obstacles.push(new Obstacle(screenLength, characterHitBoxWidth, pipeWidth));
  }, obstacleInterval);

  if (previousBest < bestDistance) {
    previousBest = bestDistance;
  }
  bestDistance = 0;
}

function generateBirds(N) {
  const birds = [];
  for (let i = 1; i <= N; i++) {
    birds.push(
      new Character(characterPosX, characterPosY, characterHitBoxWidth)
    );
  }
  return birds;
}

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestBird.brain));
  resetGame();
  console.log("Successfuly saved :", bestBird.brain);
}

function discard() {
  localStorage.removeItem("bestBrain");
  resetGame();
  console.log("Successfuly deleted :", bestBird.brain);
}

function animate() {
  //Find the best brain
  bestBird = birds.find(
    (c) => c.distance == Math.max(...birds.map((c) => c.distance))
  );

  allDamaged = birds.every((character) => character.damaged);

  if (!allDamaged) {
    //Redraw the Canvas
    Gamecanvas.height = 600;
    Gamecanvas.width = 600;
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
    for (let i = 0; i < birds.length; i++) {
      birds[i].Update(obstacles, screenLength);
    }

    //Draw characters
    for (let i = 0; i < birds.length; i++) {
      if (birds[i] === bestBird) {
        birds[i].Draw(ctx, true);
      } else {
        birds[i].Draw(ctx);
      }
    }

    //Best Distance
    bestDistance = bestBird.distance;

    // Draw Score
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText(`All time Best Distance: ${previousBest}`, 10, 30);
    ctx.fillText(`Current Best Distance: ${bestDistance}`, 10, 50);
  } else {
  }

  Visualizer.drawNetwork(netctx, bestBird.brain);

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

window.save = save;
window.discard = discard;
window.reset = resetGame;
