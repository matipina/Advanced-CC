// Pixelated Face Mask
// Combines: ml5 FaceMesh + pixel array + createGraphics
//
// How it works:
//   1. Every frame, sample the video's pixels in a coarse grid (pixelation)
//   2. Draw those coloured squares onto an offscreen buffer (pixelLayer)
//   3. Use the faceOval keypoints to build a clipping mask on a second buffer (maskLayer)
//   4. Composite: video → maskLayer (pixel art, clipped to face) → keypoint dots (optional)
//
// The result: the raw video shows through everywhere EXCEPT the face,
// where it is replaced by a pixelated, mosaic version of itself.

let faceMesh;
let video;
let faces = [];

let pixelLayer;  // offscreen buffer — pixelated version of the full frame
let maskLayer;   // offscreen buffer — face-shaped window into pixelLayer

const W = 640;
const H = 480;
const PIXEL_SIZE = 12; // size of each mosaic tile — try values between 6 and 40

async function setup() {
  faceMesh = await ml5.faceMesh({ maxFaces: 1, flipped: true, refineLandmarks: false });

  createCanvas(W, H);

  video = createCapture(VIDEO);
  video.size(W, H);
  video.hide();

  faceMesh.detectStart(video, gotFaces);

  // Offscreen buffer that holds the pixelated frame
  pixelLayer = createGraphics(W, H);
  pixelLayer.noStroke();

  // Offscreen buffer used as the face mask
  // We draw the face oval as a filled shape, then use it to clip
  maskLayer = createGraphics(W, H);
}

function draw() {
  // ── 1. Draw the mirrored live video as the background ──────────────────
  push();
  translate(W, 0);
  scale(-1, 1);
  image(video, 0, 0, W, H);
  pop();

  // ── 2. Build the pixelated frame on pixelLayer ─────────────────────────
  // We read pixels from the video element directly.
  video.loadPixels();

  if (video.pixels.length > 0) {
    pixelLayer.clear();

    for (let y = 0; y < H; y += PIXEL_SIZE) {
      for (let x = 0; x < W; x += PIXEL_SIZE) {
        // Mirror the x coordinate to match how we draw the video
        let srcX = W - 1 - x;

        // Clamp to valid range
        srcX = constrain(srcX, 0, W - 1);
        let srcY = constrain(y, 0, H - 1);

        // Sample one pixel from the video
        let idx = (srcX + srcY * W) * 4;
        let r = video.pixels[idx];
        let g = video.pixels[idx + 1];
        let b = video.pixels[idx + 2];

        pixelLayer.fill(r, g, b);
        pixelLayer.rect(x, y, PIXEL_SIZE, PIXEL_SIZE);
      }
    }
  }

  // ── 3. Build the face mask on maskLayer ────────────────────────────────
  // Clear the mask buffer completely (transparent)
  maskLayer.clear();

  if (faces.length > 0) {
    let face = faces[0];
    let oval = face.faceOval;

    if (oval && oval.keypoints && oval.keypoints.length > 0) {
      // Draw a filled white shape tracing the face oval.
      // We'll use this as a stencil: only pixels inside the shape will show.
      maskLayer.noStroke();
      maskLayer.fill(255);
      maskLayer.beginShape();
      for (let pt of oval.keypoints) {
        maskLayer.vertex(pt.x, pt.y);
      }
      maskLayer.endShape(CLOSE);

      // ── 4. Clip pixelLayer to the face oval ─────────────────────────────
      // p5 doesn't have native clipping on graphics buffers, so we use
      // drawingContext (the underlying Canvas 2D API) directly.
      //
      // Steps:
      //   a) Get the mask buffer's ImageData (white = inside face)
      //   b) Use it as an alpha channel on the pixel layer
      //   c) Draw the result onto the main canvas

      let maskPG = maskLayer;
      let pixPG  = pixelLayer;

      // Grab raw pixel data from both buffers
      maskPG.loadPixels();
      pixPG.loadPixels();

      if (maskPG.pixels.length > 0 && pixPG.pixels.length > 0) {
        // Apply the mask: wherever maskLayer is white, keep pixelLayer's pixel;
        // elsewhere make it transparent.
        for (let i = 0; i < pixPG.pixels.length; i += 4) {
          // maskLayer red channel tells us if this pixel is "inside" the face
          let inside = maskPG.pixels[i]; // 255 = inside, 0 = outside
          pixPG.pixels[i + 3] = inside;  // write as alpha of pixelLayer
        }
        pixPG.updatePixels();
      }

      // ── 5. Composite the clipped pixel layer over the live video ────────
      image(pixPG, 0, 0);
    }
  }
}

// ml5 callback — called continuously with fresh face data
function gotFaces(results) {
  faces = results;
}
