export class Obstacle {
  constructor(screenLength, characterHitBoxWidth, pipeWidth) {
    this.pipeWidth = pipeWidth;
    this.x = screenLength;
    this.points = 10;
    this.borders = [];
    this.screenLength = screenLength;

    const gapFactor = 10;
    this.gapheight = characterHitBoxWidth * gapFactor; //This should be the character's hitbox width + gap

    this.GeneratePipes();
  }

  GeneratePipes() {
    //Randomly check if we do 2 pipes or 1 pipe
    const twoPipes = Math.random() < 0.5;

    //Get a random height depending on the screenLength and the gapHeight
    const topPipeY = Math.random() * (this.screenLength - this.gapheight);
    const bottomPipeY = topPipeY + this.gapheight;
    const pipeX = this.x;

    const topPipeTopLeft = { x: pipeX, y: 0 };
    const topPipeTopRight = { x: pipeX + this.pipeWidth, y: 0 };
    const topPipeBottomLeft = { x: pipeX, y: topPipeY };
    const topPipeBottomRight = { x: pipeX + this.pipeWidth, y: topPipeY };

    const bottomPipeTopLeft = { x: pipeX, y: bottomPipeY };
    const bottomPipeTopRight = { x: pipeX + this.pipeWidth, y: bottomPipeY };
    const bottomPipeBottomLeft = {
      x: pipeX,
      y: this.screenLength,
    };
    const bottomPipeBottomRight = {
      x: pipeX + this.pipeWidth,
      y: this.screenLength,
    };

    if (twoPipes) {
      this.borders = [
        [topPipeTopLeft, topPipeBottomLeft, topPipeBottomRight],
        [bottomPipeBottomLeft, bottomPipeTopLeft, bottomPipeTopRight],
      ];
    } else {
      //Randomly check if we do top pipe or bottom pipe
      const topPipe = Math.random() < 0.5;

      if (topPipe) {
        this.borders = [
          [topPipeTopLeft, topPipeBottomLeft, topPipeBottomRight],
        ];
      } else {
        this.borders = [
          [bottomPipeBottomLeft, bottomPipeTopLeft, bottomPipeTopRight],
        ];
      }
    }
  }

  Draw(ctx) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "yellow";

    this.borders.forEach((border) => {
      const [left, right, side] = border;
      console.log(border);
      ctx.beginPath();
      ctx.moveTo(left.x, left.y);
      ctx.lineTo(right.x, right.y);
      ctx.lineTo(side.x, side.y);
      ctx.lineTo(left.x + this.pipeWidth, left.y);
      ctx.stroke();
    });
  }

  // Method to update the position of the obstacle
  Update(obstaclesArray) {
    this.x -= 2; // Move obstacle to the left

    // Update the positions of the borders
    this.borders.forEach((border) => {
      border[0].x -= 2;
      border[1].x -= 2;
      border[2].x -= 2;
      console.log(border);
    });
  }

  score(characterPosX, characterHitBoxWidth) {
    if (characterPosX - characterHitBoxWidth > this.x + this.pipeWidth) {
      return this.points;
    }
  }

  isOffScreen() {
    return this.x + this.pipeWidth < 0;
  }
}
