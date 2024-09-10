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
    const topPipeBottomRight = { x: pipeX + this.pipeWidth, y: topPipeY };
    const bottomPipeTopLeft = { x: pipeX, y: bottomPipeY };
    const bottomPipeBottomRight = {
      x: pipeX + this.pipeWidth,
      y: bottomPipeY + bottomPipeY,
    };

    if (twoPipes) {
      this.borders = [
        [topPipeTopLeft, topPipeBottomRight],
        [bottomPipeTopLeft, bottomPipeBottomRight],
      ];
    } else {
      //Randomly check if we do top pipe or bottom pipe
      const topPipe = Math.random() < 0.5;

      if (topPipe) {
        this.borders = [[topPipeTopLeft, topPipeBottomRight]];
      } else {
        this.borders = [[bottomPipeTopLeft, bottomPipeBottomRight]];
      }
    }

    console.log(this.borders);
  }

  Draw(ctx) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "yellow";

    this.borders.forEach((border) => {
      const [topLeft, bottomRight] = border;
      ctx.strokeRect(topLeft.x, topLeft.y, this.pipeWidth, bottomRight.y);
    });
  }

  // Method to update the position of the obstacle
  Update() {
    this.x -= 2; // Move obstacle to the left

    // Update the positions of the borders
    this.borders.forEach((border) => {
      border[0].x = this.x;
      border[1].x = this.x + this.pipeWidth;
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
