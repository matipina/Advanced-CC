let knight;
const pixelScale = 10;

async function setup() {
  createCanvas(800, 800);
  knight = await loadImage("../assets/knight08.png");

  // loadPixels is needed so we can access the pixel array of the image!
  knight.loadPixels();
}

function draw() {
  background(0);
  //image(knight, 0, 0, width, height);

  let w = width / knight.width;
  let h = height / knight.height;

  for (let i = 0; i < knight.width; i += pixelScale) {
    for (let j = 0; j < knight.height; j += pixelScale) {
      const pixelIndex = (i + j * knight.width) * 4;
      const r = knight.pixels[pixelIndex + 0];
      const g = knight.pixels[pixelIndex + 1];
      const b = knight.pixels[pixelIndex + 2];

      fill(r, g, b);
      noStroke();
      rect(i * w, j * h, w * pixelScale);
    }
  }
  noLoop();
}
