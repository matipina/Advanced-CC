const density = "     _.,-=+:;cba!?0123456789$W#@Ñ";
//const density = " .:-i|=+%O#@";
//const density = " .:░▒▓█";

const len = density.length;
let video;
let asciiDiv;

async function setup() {
  noCanvas();
  video = createCapture(VIDEO);
  video.hide();
  video.size(1920 / 10, 1080 / 10);
  asciiDiv = createDiv();
  pixelDensity(1);
}

function draw() {
  video.loadPixels();
  let asciiImage = "";
  for (let j = 0; j < video.height; j += 1) {
    for (let i = 0; i < video.width; i += 1) {
      const pixelIndex = (i + j * video.width) * 4;
      const r = video.pixels[pixelIndex + 0];
      const g = video.pixels[pixelIndex + 1];
      const b = video.pixels[pixelIndex + 2];

      const avg = (r + g + b) / 3;
      const charIndex = floor(map(avg, 0, 255, len, 0));
      const char = density[charIndex];
      if (char === " ") chat = "&nbsp";
      asciiImage += char;
    }
    asciiImage += "<br/>";
  }
  asciiDiv.html(asciiImage);
}
