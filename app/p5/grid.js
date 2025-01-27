const canvasWidth = 1400;
const canvasHeight = 1200;

let img;

// Load the image.
function preload() {
  img = loadImage('https://p5js.org/favicon.ico?');
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  noLoop()
}

function draw() {
  background(22);
  drawItemsBasedOnSize(canvasWidth, canvasHeight, 16, 50);
}

let debug = false

function drawItemsBasedOnSize(width, height, itemSize, gap) {
  const itemsPerRow = Math.floor((width + gap) / (itemSize +gap));
  const itemsPerColumn = Math.floor((height +gap) / (itemSize +gap));
  const items = itemsPerRow * itemsPerColumn;
  
  const fontSize = 12
  
  for(let i=0; i < items; i++) {
    const orderInRow = Math.floor(i % itemsPerRow)
    const x = orderInRow * (itemSize + gap);
    const row = Math.floor(i / itemsPerRow)
    const y = row * (itemSize + gap);
    

    renderItem(x, y, itemSize, i, items)
    
    if (debug) {
      fill('#888')
      textSize(fontSize)
      text(i, x, y + fontSize)

      fill('#444')
      text(orderInRow, x, y + 2 * fontSize)
    }
  }
  
}

function renderItem(x, y, itemSize, i, items) {
    renderImage(x, y, itemSize, i, items)
}

function renderSquare(x,y, itemSize) {
  fill('#bbdf32')
    strokeWeight(0)
    square(x, y, itemSize)
}

function renderImage(x,y, itemSize, i, items) {
  const blurRadius = lerp(0, 10, i / items); // Calculate the blur radius
  const offscreenCanvas = createGraphics(itemSize, itemSize); // Create an off-screen canvas

  // Draw the image on the off-screen canvas with the blur
  offscreenCanvas.drawingContext.filter = `blur(${blurRadius}px)`;
  offscreenCanvas.image(img, 0, 0, itemSize, itemSize);

  // Render the blurred off-screen image to the main canvas
  image(offscreenCanvas, x, y, itemSize, itemSize);
}

function renderCircle(x,y, itemSize) {
    fill('#bbdf32')
    strokeWeight(0)
    circle(x, y, itemSize)
}