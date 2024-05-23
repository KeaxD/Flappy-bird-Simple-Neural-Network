export class Obstacle {
  constructor(screenLength, gapHeight) {
    this.screenLength = screenLength;
    this.pipeWidth = 100;
    this.gapHeight = gapHeight;
    this.heightVariance = this.getRandomHeight();
    this.x = screenLength;
    this.points = 10;
  }

  //=======Functions=======

  getRandomHeight() {
    //Get a random pipe height with a max height and a minimum of 80pixels
    const maxPipeHeight = this.screenLength - this.gapHeight - 80;
    const height = Math.random() * maxPipeHeight + 80;
    return height;
  }

  // Use both functions to draw an obstacle
  draw(ctx) {
    //make the bottom pipe the height variance
    const bottomPipeHeight = this.heightVariance;

    //Make the top pipe fill up the space left
    const topPipeHeight = this.screenLength - bottomPipeHeight - this.gapHeight;

    // Draw a top pipe
    ctx.beginPath();
    ctx.strokeStyle = "yellow";
    ctx.strokeRect(this.x, 0, this.pipeWidth, topPipeHeight);

    // Draw a bottom pipe
    ctx.beginPath();
    ctx.strokeRect(
      this.x,
      this.screenLength - bottomPipeHeight,
      this.pipeWidth,
      this.screenLength
    );
  }

  // Method to update the position of the obstacle
  update() {
    this.x -= 2; // Move obstacle to the left
  }

  checkCollision(characterPosX, characterPosY, characterHitBoxWidth) {
    //Character's top and bottom Hitboxes
    let upperHitBox = characterPosY - characterHitBoxWidth;
    let lowerHitBox = characterPosY + characterHitBoxWidth;
    if (
      characterPosX + characterHitBoxWidth >= this.x &&
      characterPosX - characterHitBoxWidth < this.x + this.pipeWidth &&
      (lowerHitBox >= this.screenLength - this.heightVariance ||
        upperHitBox <= this.screenLength - this.heightVariance - this.gapHeight)
    ) {
      return true;
    }
    return false;
  }

  score(characterPosX, characterHitBoxWidth) {
    if (characterPosX - characterHitBoxWidth > this.x + this.pipeWidth) {
      return this.points;
    }
  }
}
