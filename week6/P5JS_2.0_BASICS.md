# What's Different in p5.js 2.0

## 1. Loading Files - The Big Change!

**Old way (1.x):**

```javascript
function preload() {
  img = loadImage("cat.jpg");
}

function setup() {
  createCanvas(400, 400);
}
```

**New way (2.0):**

```javascript
async function setup() {
  createCanvas(400, 400);
  img = await loadImage("cat.jpg");
}
```

### What does `async` and `await` mean?

Think of it like waiting in line:

- **`async`** says: "This function might need to wait for something"
- **`await`** says: "Stop here and wait until this finishes"

**Example:**

```javascript
async function setup() {
  createCanvas(400, 400);

  // Wait for the image to fully load
  img = await loadImage("photo.jpg");

  // Now we can use it!
  image(img, 0, 0);
}
```

**Rule**: You can only use `await` inside `async` functions!

---

## 2. Working with Fonts

### Load fonts from Google Fonts (easier!)

```javascript
let myFont;

async function setup() {
  createCanvas(600, 400);

  myFont = await loadFont(
    "https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap",
  );

  textFont(myFont);
}
```

### Change font weight (NEW!)

```javascript
function draw() {
  textWeight(300); // Light
  text("Hello", 50, 50);

  textWeight(700); // Bold
  text("World", 50, 100);
}
```

---

## 3. Using p5.js 2.0

Add this to your HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/p5@2.2.0/lib/p5.js"></script>
```

---

## Need Help?

- p5.js 2.0 docs: https://beta.p5js.org/
- p5.js 1.x docs: https://p5js.org/
