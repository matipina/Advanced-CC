let oswald;
let weightSlider1;
let weightSlider2;
let weightSlider3;
let textInput;

async function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("canvas-wrapper");

  // Load Oswald variable font
  oswald = await loadFont("../fonts/Oswald-VariableFont_wght.ttf");

  textSize(48);
  textAlign(CENTER, CENTER);

  // Select HTML elements
  weightSlider1 = select("#weightSlider1");
  weightSlider2 = select("#weightSlider2");
  weightSlider3 = select("#weightSlider3");
  textInput = select("#textInput");
}

function draw() {
  background(220);
  fill(0);

  // Get values from sliders and text input
  let weight1 = weightSlider1.value();
  let weight2 = weightSlider2.value();
  let weight3 = weightSlider3.value();
  let displayText = textInput.value();

  // Bug workaround: call textFont() after textWeight() to apply the weight
  textWeight(weight1);
  textFont(oswald);
  text(displayText + " (" + weight1 + ")", width / 2, height / 2 - 80);

  textWeight(weight2);
  textFont(oswald);
  text(displayText + " (" + weight2 + ")", width / 2, height / 2);

  textWeight(weight3);
  textFont(oswald);
  text(displayText + " (" + weight3 + ")", width / 2, height / 2 + 80);
}
