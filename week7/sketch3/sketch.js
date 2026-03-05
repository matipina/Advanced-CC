// ml5.js FaceMesh — Creative Filter
// Combines face tracking with createGraphics() to build a layered
// face-reactive filter. Draws eye highlights, lip tint, and face oval.
// This is the kind of structure you'll use for Project 3.

let faceMesh;
let video;
let faces = [];
let overlay; // offscreen buffer for face effects

async function setup() {
  faceMesh = await ml5.faceMesh({
    maxFaces: 1,
    flipped: true,
    refineLandmarks: true,
  });

  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Create an overlay buffer for all face-reactive drawing
  overlay = createGraphics(640, 480);

  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  // Layer 1: Video feed
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // Layer 2: Face-reactive overlay
  overlay.clear();

  if (faces.length > 0) {
    let face = faces[0];

    drawFaceOval(face);
    drawEyes(face);
    drawLips(face);
  }

  // Composite the overlay on top of the video
  image(overlay, 0, 0);

  // Status
  fill(255);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text("Faces detected: " + faces.length, 10, 10);
}

// --- Helper functions (keeping draw() clean!) ---

function drawFaceOval(face) {
  let oval = face.faceOval;
  if (!oval) return;

  overlay.noFill();
  overlay.stroke(255, 255, 255, 80);
  overlay.strokeWeight(2);

  // Draw the face oval using its keypoints
  overlay.beginShape();
  for (let pt of oval.keypoints) {
    overlay.vertex(pt.x, pt.y);
  }
  overlay.endShape(CLOSE);
}

function drawEyes(face) {
  let leftEye = face.leftEye;
  let rightEye = face.rightEye;
  if (!leftEye || !rightEye) return;

  // Glowing circles around the eyes
  overlay.noStroke();

  // Outer glow
  overlay.fill(100, 200, 255, 40);
  overlay.ellipse(
    leftEye.centerX,
    leftEye.centerY,
    leftEye.width * 2.5,
    leftEye.height * 2.5,
  );
  overlay.ellipse(
    rightEye.centerX,
    rightEye.centerY,
    rightEye.width * 2.5,
    rightEye.height * 2.5,
  );

  // Inner highlight
  overlay.fill(100, 200, 255, 80);
  overlay.ellipse(
    leftEye.centerX,
    leftEye.centerY,
    leftEye.width * 1.5,
    leftEye.height * 1.5,
  );
  overlay.ellipse(
    rightEye.centerX,
    rightEye.centerY,
    rightEye.width * 1.5,
    rightEye.height * 1.5,
  );
}

function drawLips(face) {
  let lips = face.lips;
  if (!lips) return;

  // Tinted lip shape using the lip keypoints
  overlay.fill(200, 50, 80, 100);
  overlay.noStroke();
  overlay.beginShape();
  for (let pt of lips.keypoints) {
    overlay.vertex(pt.x, pt.y);
  }
  overlay.endShape(CLOSE);
}

function gotFaces(results) {
  faces = results;
}
