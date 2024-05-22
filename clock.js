// Function to calculate and format elapsed time
function GetTime(startTime) {
  const currentTime = new Date();
  const elapsedTime = currentTime - startTime;

  return elapsedTime;
}

export function Draw(ctx, startTime) {
  const elapsedTime = GetTime(startTime);

  const hours = Math.floor(elapsedTime / 3600000)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((elapsedTime % 3600000) / 60000)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((elapsedTime % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  const milliseconds = (elapsedTime % 1000).toString().padStart(3, "0");

  var formattedTime = `${hours}:${minutes}:${seconds}:${milliseconds}`;

  ctx.font = "20px Georgia";
  ctx.strokeStyle = "black";
  ctx.strokeText("Elapsed Time: " + formattedTime, 10, 50);
}
