export class Sensor {
  constructor(character) {
    this.character = character;
    this.rayCount = 7;
    this.rayLength = 450;
    this.raySpread = Math.PI;

    this.rays = [];
    this.readings = [];
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

  update(obstaclesArray, screenLength) {
    this.#drawSensors();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(
        this.#getReading(this.rays[i], obstaclesArray, screenLength)
      );
    }
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

  #getReading(ray, obstacleArray, screenLength) {
    let touches = [];
    for (let i = 0; i < obstacleArray.length; i++) {
      const borders = obstacleArray[i].borders;
      for (let j = 0; j < borders.length; j++) {
        const [C, D, E] = borders[j];
        const touchSide = this.getIntersection(ray[0], ray[1], C, D);
        const touchTop = this.getIntersection(ray[0], ray[1], D, E);
        if (touchSide) {
          touches.push(touchSide);
        }
        if (touchTop) {
          touches.push(touchTop);
        }
      }
    }
    //Ceiling and floor Lines
    const upperBound = [
      { x: 0, y: 0 },
      { x: screenLength, y: 0 },
    ];
    const lowerBound = [
      { x: 0, y: screenLength },
      { x: screenLength, y: screenLength },
    ];

    const upperTouch = this.getIntersection(
      ray[0],
      ray[1],
      upperBound[0],
      upperBound[1]
    );
    const lowerTouch = this.getIntersection(
      ray[0],
      ray[1],
      lowerBound[0],
      lowerBound[1]
    );
    if (upperTouch) {
      touches.push(upperTouch);
    }
    if (lowerTouch) {
      touches.push(lowerTouch);
    }

    if (touches.length == 0) {
      return null;
    } else {
      const offsets = touches.map((e) => e.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((e) => e.offset == minOffset);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i];
      }
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
