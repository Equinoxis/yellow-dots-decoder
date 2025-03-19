const imageInput = document.getElementById("imageInput");
const dropZone = document.getElementById("dropZone");
const canvas = document.getElementById("imageCanvas");
const fileNameDisplay = document.getElementById("fileNameDisplay");
const ctx = canvas.getContext("2d");

let img = new Image();
let scale = 1;
let targetScale = 1;
let posX = 0,
  posY = 0;
let isDragging = false;
let startX, startY;
let animationFrame = null;

// Set fixed canvas size
canvas.width = 600;
canvas.height = 400;

dropZone.addEventListener("click", () => {
  imageInput.click();
});

// Drag & Drop Events
dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("active");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("active");
});

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("active");

  if (event.dataTransfer.files.length > 0) {
    handleFile(event.dataTransfer.files[0]);
  }
});

imageInput.addEventListener("change", (event) => {
  handleFile(event.target.files[0]);
});

async function handleFile(file) {
  if (file && file.type.startsWith("image/")) {
    fileNameDisplay.textContent = `Selected File: ${file.name}`;

    const reader = new FileReader();
    reader.onload = async function (e) {
      try {
        const imageBuffer = await Jimp.read(e.target.result);
        imageBuffer.color([
          { apply: "red", params: [-255] },
          { apply: "green", params: [-255] },
        ]);

        imageBuffer.getBase64(Jimp.MIME_PNG, (err, src) => {
          if (!err) {
            img.src = src;
          } else {
            console.error("Error processing image:", err);
          }
        });
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert("Please upload a valid image file.");
  }
}

img.onload = function () {
  scale = 1;
  targetScale = 1;
  posX = 0;
  posY = 0;
  drawImage();
};

function drawImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let imgWidth = img.width;
  let imgHeight = img.height;
  let aspectRatio = imgWidth / imgHeight;
  let newWidth = canvas.width * scale;
  let newHeight = newWidth / aspectRatio;

  if (newHeight > canvas.height * scale) {
    newHeight = canvas.height * scale;
    newWidth = newHeight * aspectRatio;
  }

  // Compute bounds for panning
  let maxX = Math.max((newWidth - canvas.width) / 2, 0);
  let maxY = Math.max((newHeight - canvas.height) / 2, 0);

  posX = Math.min(maxX, Math.max(-maxX, posX));
  posY = Math.min(maxY, Math.max(-maxY, posY));

  let offsetX = (canvas.width - newWidth) / 2 + posX;
  let offsetY = (canvas.height - newHeight) / 2 + posY;

  ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
}

// Smooth Zoom with Bound Adjustments
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  let zoomIntensity = 0.08;
  let zoomFactor = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;
  targetScale *= zoomFactor;
  targetScale = Math.max(0.5, Math.min(8, targetScale));

  animateZoom();
});

function animateZoom() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(() => {
    scale += (targetScale - scale) * 0.1;
    if (Math.abs(scale - targetScale) > 0.001) {
      animateZoom();
    }
    drawImage();
  });
}

// Smooth Pan with Bounds
canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
});

canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    let dx = (e.clientX - startX) * 0.6;
    let dy = (e.clientY - startY) * 0.6;

    posX += dx;
    posY += dy;

    startX = e.clientX;
    startY = e.clientY;

    drawImage();
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});
