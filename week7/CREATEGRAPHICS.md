# createGraphics() — Offscreen Drawing Buffers

## What Is It?

`createGraphics()` creates an **offscreen canvas** — an invisible drawing surface that you can draw on separately from your main canvas. Think of it like a transparent sheet of paper you prepare on the side, and then stamp onto your main canvas whenever you want.

```javascript
let pg; // "pg" for "p5.Graphics"

async function setup() {
  createCanvas(800, 600);
  pg = createGraphics(800, 600); // Same size as main canvas (or different!)
}
```

---

## Why Use It?

### 1. Persistent Drawing Layers

The main canvas gets cleared with `background()` every frame. But a graphics buffer **keeps its contents** between frames unless you explicitly clear it.

```javascript
let paintLayer;

async function setup() {
  createCanvas(800, 600);
  paintLayer = createGraphics(800, 600);
  paintLayer.clear(); // Start transparent
}

function draw() {
  background(220); // Clears main canvas every frame

  // Draw on the persistent layer (this accumulates!)
  paintLayer.fill(255, 0, 0);
  paintLayer.noStroke();
  paintLayer.ellipse(mouseX, mouseY, 20, 20);

  // Stamp the layer onto the main canvas
  image(paintLayer, 0, 0);
}
```

This creates a paint trail that persists, even though the background is redrawn every frame. Without `createGraphics()`, you'd lose your previous drawings each frame.

### 2. Compositing / Layering

You can have multiple layers and combine them:

```javascript
let backgroundLayer;
let foregroundLayer;

async function setup() {
  createCanvas(800, 600);
  backgroundLayer = createGraphics(800, 600);
  foregroundLayer = createGraphics(800, 600);
}

function draw() {
  // Draw each layer independently
  backgroundLayer.background(30);
  backgroundLayer.fill(100);
  backgroundLayer.rect(0, 0, width, height / 2);

  foregroundLayer.clear(); // Transparent background!
  foregroundLayer.fill(255, 0, 0);
  foregroundLayer.ellipse(mouseX, mouseY, 50, 50);

  // Stack them on the main canvas
  image(backgroundLayer, 0, 0);
  image(foregroundLayer, 0, 0);
}
```

> 💡 Use `.clear()` instead of `.background()` when you want a layer to be **transparent** — this way only the things you draw on it are visible when composited.

### 3. Applying Effects to Part of the Scene

You can apply filters or pixel manipulation to one layer without affecting others:

```javascript
let effectLayer;

async function setup() {
  createCanvas(800, 600);
  effectLayer = createGraphics(800, 600);
}

function draw() {
  background(255);

  // Draw something on the effect layer
  effectLayer.clear();
  effectLayer.ellipse(mouseX, mouseY, 200, 200);

  // Apply a blur only to this layer
  effectLayer.filter(BLUR, 5);

  // Composite
  image(effectLayer, 0, 0);

  // This text is sharp — unaffected by the blur
  textSize(24);
  text("Not blurred!", 20, 40);
}
```

---

## The Basic Pattern

```javascript
// 1. Declare the variable
let pg;

// 2. Create the buffer in setup
async function setup() {
  createCanvas(800, 600);
  pg = createGraphics(400, 300); // Can be any size
}

// 3. Draw INTO the buffer using pg.method()
function draw() {
  pg.background(0);
  pg.fill(255);
  pg.ellipse(pg.width / 2, pg.height / 2, 100, 100);

  // 4. Draw the buffer ONTO the main canvas using image()
  image(pg, 0, 0);
}
```

**Important:** When drawing into a graphics buffer, every p5 drawing function needs to be called on the buffer object:
- ❌ `ellipse(50, 50, 20)` → draws on main canvas
- ✅ `pg.ellipse(50, 50, 20)` → draws on the buffer

---

## Pixel Manipulation on a Graphics Buffer

Graphics buffers have their own pixel arrays! You can use `.loadPixels()` and `.pixels[]` just like with images:

```javascript
let pg;

async function setup() {
  createCanvas(400, 400);
  pg = createGraphics(400, 400);
}

function draw() {
  // Draw something into the buffer
  pg.background(0);
  pg.fill(255);
  pg.ellipse(mouseX, mouseY, 100, 100);

  // Access its pixels
  pg.loadPixels();
  for (let i = 0; i < pg.pixels.length; i += 4) {
    // Invert the colors
    pg.pixels[i + 0] = 255 - pg.pixels[i + 0]; // R
    pg.pixels[i + 1] = 255 - pg.pixels[i + 1]; // G
    pg.pixels[i + 2] = 255 - pg.pixels[i + 2]; // B
  }
  pg.updatePixels(); // Don't forget this!

  image(pg, 0, 0);
}
```

> ⚠️ When you **modify** pixels, you must call `.updatePixels()` after you're done. (When you only read, `loadPixels()` is enough.)

---

## createGraphics + Video

This is especially useful for **Project 3**. You can layer effects on top of a live camera feed:

```javascript
let video;
let overlay;

async function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  overlay = createGraphics(640, 480);
}

function draw() {
  // Layer 1: Live video
  image(video, 0, 0);

  // Layer 2: Draw on the overlay
  overlay.clear();
  overlay.fill(255, 0, 0, 150);
  overlay.textSize(48);
  overlay.text("HELLO", mouseX, mouseY);

  // Composite
  image(overlay, 0, 0);
}
```

---

## Quick Reference

| Method | What it does |
|--------|-------------|
| `createGraphics(w, h)` | Creates a new offscreen buffer |
| `pg.clear()` | Makes the buffer fully transparent |
| `pg.background(c)` | Fills the buffer with a solid color |
| `pg.loadPixels()` | Makes `pg.pixels[]` accessible |
| `pg.updatePixels()` | Applies changes made to `pg.pixels[]` |
| `pg.remove()` | Destroys the buffer (free memory) |
| `image(pg, x, y)` | Draws the buffer onto the main canvas |
| `image(pg, x, y, w, h)` | Draws and scales the buffer |

---

## Common Gotchas

1. **Forgetting the prefix.** `fill(255)` affects the main canvas, not the buffer. Use `pg.fill(255)`.
2. **Not clearing.** If you don't call `pg.clear()` or `pg.background()`, drawings accumulate (this is sometimes what you *want*!).
3. **Size mismatch.** The buffer can be a different size than the canvas. `image(pg, 0, 0, width, height)` will scale it to fit.
4. **updatePixels().** If you modify `pg.pixels[]`, you must call `pg.updatePixels()` or the changes won't show.
