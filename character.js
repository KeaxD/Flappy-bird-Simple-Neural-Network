import { Sensor } from "./sensor.js";

export class Character {
  constructor(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;

    this.velocity = 0.2;
    this.gravity = 0.1;

    this.sensor = new Sensor(this);
  }

  Draw(ctx) {
    //Draw the character
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fill();
    this.sensor.draw(ctx);
  }

  Jump() {
    document.addEventListener("keydown", (e) => {
      this.velocity = -5;
    });
  }

  Update(obstaclesArray) {
    //Make the character fall with gravity and velocity
    this.velocity += this.gravity;
    this.y += this.velocity;
    this.sensor.update(obstaclesArray);
    this.Jump();
  }
}
