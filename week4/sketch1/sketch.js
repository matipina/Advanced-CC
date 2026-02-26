// Don't forget arrays!!

let font;
let points = [];
let firstString = "HI THIS IS COOL RIGHT??";
let noiseFactor = 20;

async function setup() {
  createCanvas(1600, 1600);
  // Load Oswald font
  font = await loadFont("../fonts/Oswald-Regular.ttf");

  textFont(font);
  textSize(160);
  textAlign(CENTER, CENTER);
  points = font.textToPoints(firstString, width / 2, height / 2, {
    sampleFactor: 0.2,
    simplifyThreshold: 0,
  });
  console.log(points);
}

function draw() {
  noiseFactor = mouseX / 10;
  console.log(noiseFactor);
  background("#F2CB05");
  fill("#F24B78");
  stroke("#F24B78");
  text(frameCount, 70, 70);
  for (let i = 0; i < points.length; i++) {
    ellipse(
      points[i].x + noiseFactor * noise(frameCount / 2 + i),
      points[i].y + noiseFactor * noise(frameCount / 4 + i),
      2,
    );
  }
}
