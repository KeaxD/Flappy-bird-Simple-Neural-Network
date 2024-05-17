export function Draw(ctx, posX, posY, characterHitBoxWidth) {
  //Draw the character
  ctx.beginPath();
  ctx.arc(posX, posY, characterHitBoxWidth, 0, 2 * Math.PI);
  ctx.strokeStyle = "red";
  ctx.stroke();
}
