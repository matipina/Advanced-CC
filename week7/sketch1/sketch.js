// createGraphics() Demo
// A persistent paint layer drawn over a live video feed.
// Move your mouse to paint — press any key to clear.

let video;
let paintLayer;

async function setup() {
  createCanvas(1280, 960);

  // Start the webcam
  video = createCapture(VIDEO);
  video.size(1280, 960);
  video.hide();

  // Create an offscreen graphics buffer (same size as canvas)
  paintLayer = createGraphics(width, height);
  paintLayer.clear(); // Start fully transparent
}

function draw() {
  // Layer 1: Live video (redrawn every frame)
  image(video, 0, 0, width, height);

  // Layer 2: Persistent paint layer
  // Draw a colored circle at the mouse position each frame.
  // Because we never clear paintLayer, the circles accumulate!
  if (mouseIsPressed) {
    let c = color(
      map(mouseX, 0, width, 50, 255),
      100,
      map(mouseY, 0, height, 255, 50),
      180
    );
    console.log(c);
    paintLayer.fill(c);
    paintLayer.noStroke();
    paintLayer.ellipse(mouseX, mouseY, 30, 30);
  }

  // Composite: stamp the paint layer on top of the video
  image(paintLayer, 0, 0);

  // UI hint
  fill(255);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text("Click + drag to paint · Press any key to clear", 10, 10);
}

function keyPressed() {
  // Clear the paint layer
  paintLayer.clear();
}
