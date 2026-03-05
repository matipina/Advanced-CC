const density = "         _.,-=+:;cba!?0123456789$W#@Ñ";
//const density = "     .:-i|=+%O#@";
//const density = "  .:░▒▓█";

const len = density.length;
let pixelScale = 8;
let pixelScaleSlider;
let knight;


async function setup() {
  createCanvas(800, 800);
  knight = await loadImage("../assets/knight2.png");

  // loadPixels is needed so we can access the pixel array of the image!
  knight.loadPixels();
  textAlign(CENTER, CENTER);
  pixelScaleSlider = createSlider(8, 80, 8, 1);
}

function draw() {
  pixelScale = pixelScaleSlider.value();
  background(0);

  let w = width / knight.width;
  let h = height / knight.height;

  textSize(w * pixelScale);

  //
  for (let i = 0; i < knight.width; i += pixelScale) {
    for (let j = 0; j < knight.height; j += pixelScale) {
      const pixelIndex = (i + j * knight.width) * 4;
      const r = knight.pixels[pixelIndex + 0];
      const g = knight.pixels[pixelIndex + 1];
      const b = knight.pixels[pixelIndex + 2];

      const avg = (r + g + b) / 3;
      const charIndex = floor(map(avg, 0, 255, 0, len));
      const char = density[charIndex];

      fill(255);
      text(char, i * w + w * pixelScale * 0.5, j * h + h * pixelScale * 0.5);
    }
  }
}
