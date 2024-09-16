import { Sensor } from "./sensor.js";
import { NeuralNetwork } from "./network.js";
export class Character {
  constructor(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;

    this.velocity = 0.2;
    this.gravity = 0.1;

    this.damaged = false;

    this.sensor = new Sensor(this);
    this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 1]);
  }

  Draw(ctx) {
    //Draw the character
    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = "black";
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    this.sensor.draw(ctx);
  }

  // Jump() {
  //   document.addEventListener("keydown", (e) => {
  //     this.velocity = -5;
  //   });
  // }

  Update(obstaclesArray, screenLength) {
    //Make the character fall with gravity and velocity
    this.velocity += this.gravity;
    this.y += this.velocity;

    // Update sensor readings
    this.sensor.update(obstaclesArray, screenLength);
    this.damaged =
      this.#assessDamage(obstaclesArray) || this.#outOfBounds(screenLength);

    // Get inputs from sensors
    const offsets = this.sensor.readings.map((s) =>
      s == null ? 0 : 1 - s.offset
    );

    // Get outputs from neural network
    const outputs = NeuralNetwork.feedForward(offsets, this.brain);

    // Use single output neuron to decide action (e.g., jump)
    if (outputs[0] > 0.5) {
      // Perform jump action
      this.velocity = -5;
    }
  }

  #outOfBounds(screenLength) {
    const upperBound = [
      { x: 0, y: 0 },
      { x: screenLength, y: 0 },
    ];
    const lowerBound = [
      { x: 0, y: screenLength },
      { x: screenLength, y: screenLength },
    ];
    const upperBoundTouch = this.lineIntersectsCircle(
      upperBound[0],
      upperBound[1],
      this.x,
      this.y,
      this.width
    );
    const lowerBoundTouch = this.lineIntersectsCircle(
      lowerBound[0],
      lowerBound[1],
      this.x,
      this.y,
      this.width
    );
    if (upperBoundTouch || lowerBoundTouch) {
      return true;
    }
  }

  #assessDamage(obstacleArray) {
    for (let i = 0; i < obstacleArray.length; i++) {
      const borders = obstacleArray[i].borders;
      for (let j = 0; j < borders.length; j++) {
        const [C, D, E] = borders[j];
        const touchSide = this.lineIntersectsCircle(
          C,
          D,
          this.x,
          this.y,
          this.width
        );
        const touchTop = this.lineIntersectsCircle(
          D,
          E,
          this.x,
          this.y,
          this.width
        );
        if (touchSide || touchTop) {
          return true;
        }
      }
    }
  }

  lineIntersectsCircle(p1, p2, cx, cy, r) {
    // Calculate the coefficients of the quadratic equation
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const A = dx * dx + dy * dy;
    const B = 2 * (dx * (p1.x - cx) + dy * (p1.y - cy));
    const C = (p1.x - cx) * (p1.x - cx) + (p1.y - cy) * (p1.y - cy) - r * r;

    // Calculate the discriminant
    const discriminant = B * B - 4 * A * C;

    // No intersection
    if (discriminant < 0) {
      return false;
    }

    // Calculate the two points of intersection
    const t1 = (-B + Math.sqrt(discriminant)) / (2 * A);
    const t2 = (-B - Math.sqrt(discriminant)) / (2 * A);

    // Check if the intersection points are within the segment bounds
    if ((t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1)) {
      return true;
    }

    return false;
  }

  //console.log(lineIntersectsCircle(x1, y1, x2, y2, cx, cy, r)); // Should return true or false
}
