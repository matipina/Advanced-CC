// Don't forget arrays!!

let font;
let points = [];
let firstString = "This is crazyyyyy";

async function setup() {
  createCanvas(800, 800);

  // Load Oswald font (not variable)
  font = await loadFont("../fonts/Oswald-Regular.ttf");
  textFont(font);
  textSize(120);
  textAlign(CENTER, CENTER);

  points = font.textToPoints(firstString, width / 2, height / 2, {
    sampleFactor: 0.2,
  });
}

function draw() {
  background("#F2CB05");
  fill("#F24B78");
  stroke("#F24B78");
  //text(text, width / 2, height / 2);
  for (let i = 0; i < points.length; i++) {
    ellipse(
      points[i].x + sin(frameCount / 2 + i) * 2,
      points[i].y + 10 * noise(frameCount / 4 + i),
      2,
    );
  }
}
