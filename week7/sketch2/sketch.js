// ml5.js FaceMesh — Basic Keypoints
// The simplest possible face tracking setup.
// Draws all 468 keypoints on top of the webcam feed.

let faceMesh;
let video;
let faces = [];



async function setup() {
  faceMesh = await ml5.faceMesh({ maxFaces: 1, flipped: true });

  createCanvas(640, 480);

  // Start the webcam
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Start continuous face detection
  // gotFaces will be called every time ml5 has new results
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  // Draw the video mirrored (like a selfie camera)
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // Loop through all detected faces
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];

    // Draw every keypoint
    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];

      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 4);
    }
  }

  // Status text
  fill(255);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text("Faces detected: " + faces.length, 10, 10);
}

// Callback — ml5 calls this whenever it finishes analyzing a frame
function gotFaces(results) {
  faces = results;
}
