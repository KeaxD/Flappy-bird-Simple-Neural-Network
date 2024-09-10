export class Sensor {
  constructor(character) {
    this.character = character;
    this.rayCount = 5;
    this.rayLength = 200;
    this.raySpread = Math.PI;

    this.rays = [];
  }

  lerp(A, B, t) {
    return A + (B - A) * t;
  }

  getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom != 0) {
      const t = tTop / bottom;
      const u = uTop / bottom;
      if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
          x: this.lerp(A.x, B.x, t),
          y: this.lerp(A.y, B.y, t),
          offset: t,
        };
      }
    }
    return null;
  }

  update() {
    this.#drawSensors();
  }

  #drawSensors() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = this.lerp(
        this.raySpread / 2,
        -this.raySpread / 2,
        i / (this.rayCount - 1)
      );
      const start = { x: this.character.x, y: this.character.y };
      const end = {
        x: this.character.x + Math.cos(rayAngle) * this.rayLength,
        y: this.character.y + Math.sin(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.stroke();
    }
  }
}
