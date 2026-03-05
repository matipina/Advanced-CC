# Understanding the Pixel Array

Every digital image is a grid of **pixels**. In p5.js, once you call `loadPixels()` on an image (or video, or canvas), you get access to a flat array called `.pixels[]` that contains the color data for every single pixel.

---

## How Pixels Are Stored

Each pixel has **4 values** stored in sequence:

| Index | Channel | Range |
|-------|---------|-------|
| 0 | **R** (Red) | 0–255 |
| 1 | **G** (Green) | 0–255 |
| 2 | **B** (Blue) | 0–255 |
| 3 | **A** (Alpha) | 0–255 |

So the `.pixels[]` array looks like this:

```
[R, G, B, A, R, G, B, A, R, G, B, A, ...]
 ← pixel 0 → ← pixel 1 → ← pixel 2 →
```

A 3×2 image (3 pixels wide, 2 pixels tall) has `3 × 2 = 6` pixels, and the `.pixels[]` array has `6 × 4 = 24` values.

---

## The Index Formula

To get the color of a specific pixel at position `(x, y)`:

```javascript
const index = (x + y * width) * 4;

const r = pixels[index + 0]; // Red
const g = pixels[index + 1]; // Green
const b = pixels[index + 2]; // Blue
const a = pixels[index + 3]; // Alpha
```

### Why `(x + y * width) * 4`?

The pixels are stored **row by row** (left to right, top to bottom), but in a flat 1D array instead of a 2D grid. Think of it like reading a book: you go through each row from left to right, then move to the next row.

- `x + y * width` gives you the **pixel number** (which pixel it is, counting from 0)
- `× 4` gives you the **starting index** in the array (because each pixel takes 4 slots)

**Visual example** (4 pixels wide):

```
Row 0:  pixel(0,0)  pixel(1,0)  pixel(2,0)  pixel(3,0)
Row 1:  pixel(0,1)  pixel(1,1)  pixel(2,1)  pixel(3,1)

Flat:   [0] [1] [2] [3] [4] [5] [6] [7]  ← pixel numbers

To find pixel(2, 1):
  pixel number = 2 + 1 * 4 = 6
  array index  = 6 * 4 = 24
  → R is at pixels[24], G at [25], B at [26], A at [27]
```

---

## The Basic Pattern

```javascript
// 1. Load the pixels into the array
img.loadPixels();

// 2. Loop through x and y coordinates
for (let y = 0; y < img.height; y++) {
  for (let x = 0; x < img.width; x++) {
    
    // 3. Calculate the index
    const index = (x + y * img.width) * 4;
    
    // 4. Read the color values
    const r = img.pixels[index + 0];
    const g = img.pixels[index + 1];
    const b = img.pixels[index + 2];
    
    // 5. Do something with them!
  }
}
```

> ⚠️ You **must** call `loadPixels()` before accessing `.pixels[]`. Otherwise the array is empty.

---

## Week 6 Sketch Walkthroughs

### Sketch 1 — Pixelation

**File:** `week6/sketch1/sketch.js`

This sketch loads a knight image and redraws it as a grid of colored rectangles, creating a pixelated effect.

```javascript
let knight;
const pixelScale = 10;

async function setup() {
  createCanvas(800, 800);
  knight = await loadImage("../assets/knight08.png");
  knight.loadPixels(); // ← Required!
}
```

**What's happening:**
- The image is loaded and its pixels are made accessible
- `pixelScale = 10` means we sample every 10th pixel (skip 9 in between)

```javascript
let w = width / knight.width;   // How wide each "cell" is on the canvas
let h = height / knight.height; // How tall each "cell" is on the canvas

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
```

**Key ideas:**
- We don't look at every pixel — we **step by `pixelScale`** (`i += pixelScale`), sampling one pixel per block
- For each sampled pixel, we read its RGB color and draw a rectangle filled with that color
- `w` and `h` map from image coordinates to canvas coordinates (the image might be a different size than the canvas)
- The rectangle size is `w * pixelScale` — big enough to cover the area of all the pixels we skipped

**Try changing:**
- `pixelScale = 1` → you'll see the original image (one rect per pixel)
- `pixelScale = 30` → much blockier, very pixelated
- Replace `rect` with `ellipse` → dot matrix effect

---

### Sketch 2 — ASCII Art (Static Image)

**File:** `week6/sketch2/sketch.js`

This sketch converts an image into ASCII characters, where each character represents the brightness of that area.

```javascript
const density = "         _.,-=+:;cba!?0123456789$W#@Ñ";
const len = density.length;
```

**The density string** is the heart of ASCII art. Characters are ordered from "lightest" (spaces) to "darkest" (Ñ). When we map a pixel's brightness to this string:
- Dark pixels → characters at the end (dense, like `@` or `Ñ`)
- Bright pixels → characters at the start (sparse, like `.` or space)

```javascript
const avg = (r + g + b) / 3;                    // Brightness (0–255)
const charIndex = floor(map(avg, 0, 255, 0, len)); // Map to string index
const char = density[charIndex];                 // Get the character
```

**How it works:**
1. For each sampled pixel, average R+G+B to get a single brightness value
2. `map(avg, 0, 255, 0, len)` scales that brightness to an index in the density string
3. Look up the corresponding character
4. Draw it at the pixel's position using `text()`

**Try changing:**
- Reverse the density string → inverted image (like a photo negative)
- Use `"  .:░▒▓█"` → block-style ASCII art
- Change `fill(255)` to `fill(r, g, b)` → colored ASCII art!

---

### Sketch 3 — Live Webcam ASCII

**File:** `week6/sketch3/sketch.js`

This builds on Sketch 2 but uses **live webcam video** instead of a static image, and outputs the ASCII art as **HTML text** instead of drawing on a canvas.

```javascript
async function setup() {
  noCanvas();                              // No p5 canvas needed!
  video = createCapture(VIDEO);            // Start webcam
  video.hide();                            // Hide the raw video element
  video.size(1920 / 16, 1080 / 16);       // Small resolution = fewer characters
  asciiDiv = createDiv();                  // A <div> to hold the ASCII output
}
```

**Key differences from Sketch 2:**
- `noCanvas()` — we're not drawing on a p5 canvas at all
- `createCapture(VIDEO)` — grabs the live webcam feed
- `video.size(120, 67)` — intentionally tiny! Each pixel becomes one character, so a small video = manageable amount of text
- The ASCII text is injected as HTML into a `<div>` using `.html()`

```javascript
function draw() {
  video.loadPixels();           // Refresh pixel data each frame
  let asciiImage = "";
  for (let j = 0; j < video.height; j++) {
    for (let i = 0; i < video.width; i++) {
      // ... same brightness → character mapping ...
      asciiImage += char;
    }
    asciiImage += "<br/>";      // New line after each row
  }
  asciiDiv.html(asciiImage);    // Update the HTML
}
```

**Important:** Notice that `video.loadPixels()` is called **every frame** inside `draw()`. Unlike the static image sketches (which use `noLoop()`), video pixels change constantly, so we need to re-read them each frame.

**The `<br/>` trick:** Since we're building an HTML string, each row of characters needs a line break tag to stay on its own line.

> 🐛 **Spot the bug!** There's a typo on this line: `if (char === " ") chat = "&nbsp";` — `chat` should be `char`. This means spaces don't get converted to `&nbsp;` (non-breaking spaces), which might cause some visual issues with spacing.

---

## Brightness Shortcuts

Getting brightness from RGB is a common operation. Here are a few approaches:

```javascript
// Simple average
const brightness = (r + g + b) / 3;

// Luminance (weighted — closer to how humans perceive brightness)
const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

// Using p5's built-in (works with color objects)
const brightness = brightness(color(r, g, b));
```

The simple average works well for most creative coding purposes. The luminance formula is more perceptually accurate — green contributes most to perceived brightness, blue the least.

---

## Performance Tips

- **Sample, don't scan every pixel.** Use a step value (`pixelScale`) to skip pixels — the visual difference is often minimal but the speed improvement is huge
- **`noLoop()` for static images.** If the image doesn't change, there's no reason to keep calling `draw()` 60 times a second
- **Small video sizes.** For real-time video effects, resize the video to be small before processing (like sketch3 does with `video.size(120, 67)`)
- **Avoid `get(x, y)`** for reading lots of pixels — the pixel array is much faster
