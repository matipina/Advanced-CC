const messages = [
  'Hey!',
  'This is me?',
  'This is me??',
  'This is me???',
  'This is me...',
  'Is this really... me?',
  'Hmmm...',
  'I guess... this must me.',
  'How weird.',
  'Oh well.',
  'I guess I will just be me, then.',
  '.',
  '..',
  '...',
  'Yeah, I will just be me.',
  'That should be enough.',
  ' ',
]

const transitionTime = 200;
const density = "       _.,-=+:;cba!?0123456789$W#@Ñ";
//const density = " .:-i|=+%O#@";
//const density = " .:░▒▓█";
const len = density.length;
let video;
let asciiDiv;
let titleDiv;
let messageIndex = 0;

async function setup() {
  noCanvas();
  video = createCapture(VIDEO);
  video.hide();
  video.size(1920 / 20, 1080 / 20);
  titleDiv = createDiv();
  titleDiv.html(messages[messageIndex]);

  asciiDiv = createDiv();
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
      let char = density[charIndex];
      if (char == " ") char = "&nbsp";
      asciiImage += char;
    }
    asciiImage += "<br/>";
  }
  asciiDiv.html(asciiImage);

  if (frameCount%transitionTime==0 ) changeMessage();
}

function changeMessage() {
  if (messageIndex < messages.length - 1) {
    messageIndex += 1;
  }
  else {
    messageIndex = 0;
  }
  titleDiv.html(messages[messageIndex]);

}