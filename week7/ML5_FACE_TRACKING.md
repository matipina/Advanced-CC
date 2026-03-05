# ml5.js — Face Tracking with FaceMesh

## What Is ml5.js?

[ml5.js](https://ml5js.org/) is a library that gives you access to **pre-trained machine learning models** right in the browser. No servers, no Python, no GPU setup — just a script tag and you're running real ML.

ml5 offers models for:
- **FaceMesh** — 468 facial landmarks (what we're using today)
- **BodyPose** — full body skeleton tracking
- **HandPose** — hand and finger tracking
- **Image Classification** — identifying objects in images
- **Object Detection** — finding and locating objects
- And more…

Today we'll focus on **FaceMesh** — detecting faces and getting precise coordinates for eyes, lips, nose, jawline, and more.

---

## Setup

Add the ml5.js library to your `index.html`, alongside p5.js:

```html
<head>
  <script src="https://cdn.jsdelivr.net/npm/p5@2.2.0/lib/p5.js"></script>
  <script src="https://unpkg.com/ml5@1/dist/ml5.min.js"></script>
</head>
```

> ⚠️ **Order matters!** Load p5.js first, then ml5.js.

---

## Step 1: The Minimal Setup

> See **sketch2** for the full working code.

Let's get face tracking running in the fewest lines possible.

### Declare your variables

```javascript
let faceMesh;
let video;
let faces = [];
```

- `faceMesh` — the ml5 model
- `video` — the webcam feed
- `faces` — an array that will hold detected face data (starts empty)

### Load the model in `preload()`

```javascript
function preload() {
  faceMesh = ml5.faceMesh({ maxFaces: 1, flipped: true });
}
```

**Why `preload()` and not `async setup()`?**

ml5 models are designed to load inside p5's `preload()` function. This guarantees the model is fully loaded before `setup()` runs. This is different from p5.js 2.0's `await` pattern for images and fonts — ml5 uses the older callback/preload approach.

**Options:**
- `maxFaces: 1` — detect only one face (faster)
- `flipped: true` — mirror the video horizontally (so it feels like a mirror)

### Set up the webcam and start detection

```javascript
async function setup() {
  createCanvas(640, 480);
  
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  
  faceMesh.detectStart(video, gotFaces);
}
```

- `createCapture(VIDEO)` — starts the webcam
- `video.hide()` — hides the raw HTML video element (we'll draw it ourselves)
- `faceMesh.detectStart(video, gotFaces)` — tells the model to continuously analyze the video and call `gotFaces` whenever it has results

### The callback function

```javascript
function gotFaces(results) {
  faces = results;
}
```

This gets called automatically by ml5 every time it finishes analyzing a frame. It receives an array of detected faces and we store it in our `faces` variable.

### Draw the keypoints

```javascript
function draw() {
  image(video, 0, 0, width, height);
  
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    
    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 4);
    }
  }
}
```

**What's in `face.keypoints`?**

Each face has **468 keypoints**. Each keypoint is an object:

```javascript
{
  x: 320.5,   // horizontal position
  y: 240.3,   // vertical position
  z: -12.1,   // depth (distance from camera)
  name: "noseTip"  // only some keypoints have names
}
```

The keypoints map to specific facial features — eyes, nose, lips, jawline, eyebrows, etc.

---

## Step 2: Working with Specific Face Parts

> See **sketch3** for the full working code.

Drawing all 468 keypoints is great for debugging, but for creative work you usually want to target **specific parts** of the face.

### Named Face Parts

Each detected face comes with pre-grouped parts:

```javascript
let face = faces[0];

face.faceOval     // { x, y, width, height, centerX, centerY, keypoints: [...] }
face.leftEye      // { x, y, width, height, centerX, centerY, keypoints: [...] }
face.rightEye     // { x, y, width, height, centerX, centerY, keypoints: [...] }
face.lips         // { x, y, width, height, centerX, centerY, keypoints: [...] }
face.leftEyebrow  // { x, y, width, height, centerX, centerY, keypoints: [...] }
face.rightEyebrow // { x, y, width, height, centerX, centerY, keypoints: [...] }
```

Each part gives you:
- `centerX`, `centerY` — the center of that feature
- `width`, `height` — the bounding box dimensions
- `keypoints` — the specific landmark points for that feature

### Drawing Around the Eyes

```javascript
function draw() {
  image(video, 0, 0, width, height);

  if (faces.length > 0) {
    let face = faces[0];

    // Draw circles at each eye center
    fill(0, 255, 255, 150);
    noStroke();
    ellipse(face.leftEye.centerX, face.leftEye.centerY,
            face.leftEye.width * 1.5, face.leftEye.height * 1.5);
    ellipse(face.rightEye.centerX, face.rightEye.centerY,
            face.rightEye.width * 1.5, face.rightEye.height * 1.5);
  }
}
```

### Drawing the Lip Outline

You can use a face part's keypoints to draw a shape:

```javascript
if (faces.length > 0) {
  let lips = faces[0].lips;

  fill(255, 0, 0, 100);
  noStroke();
  beginShape();
  for (let pt of lips.keypoints) {
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE);
}
```

### The Bounding Box

Each face also has a bounding box:

```javascript
let face = faces[0];
let box = face.box;

// box.xMin, box.yMin — top-left corner
// box.xMax, box.yMax — bottom-right corner
// box.width, box.height — dimensions

noFill();
stroke(255, 255, 0);
strokeWeight(2);
rect(box.xMin, box.yMin, box.width, box.height);
```

---

## Step 3: Combining with createGraphics()

The real power comes from layering face tracking with offscreen buffers. This is the pattern you'll use for **Project 3**.

```javascript
let faceMesh, video, faces = [];
let overlay;

function preload() {
  faceMesh = ml5.faceMesh({ maxFaces: 1, flipped: true });
}

async function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  overlay = createGraphics(640, 480);

  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  // Layer 1: Video
  image(video, 0, 0, width, height);

  // Layer 2: Face-reactive overlay
  overlay.clear();

  if (faces.length > 0) {
    let face = faces[0];
    
    // Draw on the overlay based on face position
    overlay.fill(255, 0, 100, 150);
    overlay.noStroke();
    overlay.ellipse(face.lips.centerX, face.lips.centerY,
                    face.lips.width * 2, face.lips.height * 2);
  }

  // Composite
  image(overlay, 0, 0);
}

function gotFaces(results) {
  faces = results;
}
```

**Why use `createGraphics()` here?**
- You can apply effects (blur, tint, pixel manipulation) to the overlay **without affecting the video**
- You can build up persistent drawings that follow the face
- You can have multiple independent layers

---

## Useful Keypoint Indices

While most work can be done with the named parts (`.leftEye`, `.lips`, etc.), sometimes you need specific keypoints. Here are some commonly used ones:

| Index | Location |
|-------|----------|
| 1 | Between the eyes |
| 4 | Nose tip |
| 13 | Upper lip center |
| 14 | Lower lip center |
| 33 | Left eye inner corner |
| 133 | Left eye outer corner |
| 263 | Right eye inner corner |
| 362 | Right eye outer corner |
| 10 | Top of forehead |
| 152 | Bottom of chin |

Access them with: `face.keypoints[4].x` (nose tip x-coordinate)

Full keypoint map: [FaceMesh Keypoint Map](https://github.com/tensorflow/tfjs-models/blob/master/face-landmarks-detection/mesh_map.jpg)

---

## Options Reference

```javascript
faceMesh = ml5.faceMesh({
  maxFaces: 1,           // Max number of faces to detect (default: 1)
  refineLandmarks: false, // Refine eye & lip landmarks (default: false, costs performance)
  flipped: false          // Mirror the results horizontally (default: false)
});
```

## Methods Reference

| Method | What it does |
|--------|-------------|
| `ml5.faceMesh(options)` | Creates and loads the model |
| `faceMesh.detectStart(video, callback)` | Starts continuous detection |
| `faceMesh.detectStop()` | Stops detection |
| `faceMesh.detect(image, callback)` | One-time detection on a single image |

---

## Common Issues

1. **"Model not loaded"** — Make sure `ml5.faceMesh()` is called inside `preload()`, not `setup()`
2. **Face not detected** — Ensure good lighting, face the camera directly, and check that the video is actually running
3. **Mirrored coordinates** — If your effects appear on the wrong side, toggle the `flipped` option
4. **Slow performance** — Set `maxFaces: 1` if you only need one face. Lower your canvas size. Avoid heavy per-pixel operations every frame
5. **Keypoints jittering** — ML detection isn't perfectly stable frame-to-frame. For smoother results, you can `lerp()` between previous and current positions:

```javascript
// Smooth a keypoint position over time
smoothX = lerp(smoothX, face.keypoints[4].x, 0.3);
smoothY = lerp(smoothY, face.keypoints[4].y, 0.3);
```
