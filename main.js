import { Character } from "./character.js";
import { NeuralNetwork } from "./network.js";
import { Obstacle } from "./obstacle.js";
import { Visualizer } from "./Visualizer.js";

//Get the measurements of the screen and apply it to the canvas
const canvasWidth = Math.floor(window.innerHeight / 1.2);

// Access the canvas element using its ID
const Gamecanvas = document.getElementById("myCanvas");
Gamecanvas.height = canvasWidth;
Gamecanvas.width = canvasWidth;
// Get the 2D drawing context from the canvas
const ctx = Gamecanvas.getContext("2d");

//Access the network canvas
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.height = canvasWidth;
networkCanvas.width = canvasWidth;

const netctx = networkCanvas.getContext("2d");

//Stats Canvas
const statsCanvas = document.getElementById("stats");
statsCanvas.height = 200;
statsCanvas.width = canvasWidth;
const statsctx = statsCanvas.getContext("2d");

let obstacles = [];

// Draw a hollow rectangle that takes the entire canvas

const characterHitBoxWidth = canvasWidth / 30;
const characterPosX = canvasWidth / 5;
const characterPosY = canvasWidth / 2;
const pipeWidth = canvasWidth / 5.6;
const obstacleInterval = 2000; // INTERVAL =======================

//==============Instantiate character ===============
const N = 500;
let mutationFactor = 0.1;
let birds = generateBirds(N);

let bestBird = birds[0]; //default to the first one

let allDamaged;

let bestDistance = 0;
let previousBest = 0;

let generation = 0;
let generationsWithoutImprovement = 0;
const maxGenerationsWithoutImprovement = 20;

// Track performance over multiple generations
const performanceWindow = 15;
let performanceHistory = [];

let auto = false;

//If saved in local storage, get that brain
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < birds.length; i++) {
    birds[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(birds[i].brain, mutationFactor);
    }
  }
}

const obstacle = new Obstacle(canvasWidth, characterHitBoxWidth, pipeWidth);
obstacles.push(obstacle);

//Instantiate Obstacles at a regular interval
let obstacleTimer = setInterval(() => {
  obstacles.push(new Obstacle(canvasWidth, characterHitBoxWidth, pipeWidth));
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

  // Reset obstacle interval
  clearInterval(obstacleTimer);

  obstacleTimer = setInterval(() => {
    obstacles.push(new Obstacle(canvasWidth, characterHitBoxWidth, pipeWidth));
  }, obstacleInterval);

  if (auto) {
    if (previousBest < bestDistance) {
      save();
      previousBest = bestDistance;
      performanceHistory.length = 0;
      generationsWithoutImprovement = 0; // Reset counter if improvement is seen
      mutationFactor = 0.1;
      generation++;
    } else {
      generationsWithoutImprovement++;
      if (generationsWithoutImprovement >= maxGenerationsWithoutImprovement) {
        // mutationFactor *= 1.1; // Increase mutation factor if no improvement
        generationsWithoutImprovement = 0; // Reset counter
      }
    }

    // Update performance history
    performanceHistory.push(bestDistance);
    if (performanceHistory.length > performanceWindow) {
      performanceHistory.shift(); // Remove oldest performance record
    }

    // Calculate average performance over the window
    const averagePerformance =
      performanceHistory.reduce((sum, value) => sum + value, 0) /
      performanceHistory.length;

    // Adjust mutation factor based on average performance trend
    if (performanceHistory.length === performanceWindow) {
      const performanceTrend =
        averagePerformance - performanceHistory[performanceHistory.length - 1];

      if (performanceTrend > 0) {
        mutationFactor *= 0.9; // Decrease mutation factor if performance is improving
      } else {
        mutationFactor += 0.05; // Increase mutation factor if performance is declining or stagnating
      }
    }
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
  console.log("Successfuly saved :", bestBird.brain);
}

function discard() {
  localStorage.removeItem("bestBrain");
  console.log("Successfuly deleted :", bestBird.brain);
}

function autoRun() {
  auto = !auto;
  console.log(auto);
}

function animate() {
  //Find the best brain
  bestBird = birds.find(
    (c) => c.distance == Math.max(...birds.map((c) => c.distance))
  );

  allDamaged = birds.every((character) => character.damaged);

  if (!allDamaged) {
    //Redraw the Canvas
    Gamecanvas.height = canvasWidth;
    Gamecanvas.width = canvasWidth;
    ctx.strokeRect(0, 0, canvasWidth, canvasWidth);

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
      birds[i].Update(obstacles, canvasWidth);
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

    // Number of birds left
    let birdsLeft = birds.filter((character) => !character.damaged).length;

    // Draw Stats
    statsCanvas.height = 100;
    statsCanvas.width = canvasWidth * 1.3;
    ctx.strokeRect(0, 0, canvasWidth, canvasWidth);
    statsctx.fillStyle = "black";
    statsctx.font = "18px Arial";
    statsctx.fillText(`All time Best Distance: ${previousBest}`, 10, 20);
    statsctx.fillText(`Current Best Distance: ${bestDistance}`, 10, 40);
    statsctx.fillText(`Birds left: ${birdsLeft}`, 10, 60);
    statsctx.fillText(`Generation: ${generation}`, 400, 20);
    statsctx.fillText(
      `Generations Without Improvement: ${generationsWithoutImprovement}`,
      400,
      40
    );
    statsctx.fillText(`Mutation Factor: ${mutationFactor}`, 400, 60);

    ctx.fillStyle = "black";
    ctx.font = "18px Arial";
    ctx.fillText(`AutoPlay: ${auto ? "On" : "Off"}`, 20, 30);
  } else {
    if (auto) {
      resetGame();
    }
  }

  Visualizer.drawNetwork(netctx, bestBird.brain);

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

window.save = save;
window.discard = discard;
window.reset = resetGame;
window.autoRun = autoRun;
