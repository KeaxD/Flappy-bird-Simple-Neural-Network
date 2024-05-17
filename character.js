export const characterHitBoxWidth = 25;

export function Draw(ctx, posX, posY) {
  //Draw the character
  ctx.beginPath();
  ctx.arc(posX, posY, characterHitBoxWidth, 0, 2 * Math.PI);
  ctx.strokeStyle = "red";
  ctx.stroke();
}
