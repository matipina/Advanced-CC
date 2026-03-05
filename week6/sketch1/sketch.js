let knight;
let pixelScale = 10;
let imageIndex;
let imagePath;
let newPixelScale;

async function setup() {
  imageIndex = Math.floor(random(10));
  imagePath = "../assets/knight" + imageIndex + ".png";

  createCanvas(780, 780);
  knight = await loadImage(imagePath);
  // loadPixels is needed so we can access the pixel array of the image!
  knight.loadPixels();
  newPixelScale = createSlider(8, width/4, 10, 1);
}

function draw() {
  pixelScale = newPixelScale.value();
  background(0);

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
}
