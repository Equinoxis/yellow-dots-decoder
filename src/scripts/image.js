import { Jimp } from "jimp";

const imageInput = document.getElementById("imageInput");
const dropZone = document.getElementById("dropZone");
const canvas = document.getElementById("imageCanvas");
const fileNameDisplay = document.getElementById("fileNameDisplay");
const ctx = canvas.getContext("2d");

const img = new Image();
let scale = 1;
let targetScale = 1;
let posX = 0;
let posY = 0;
let isDragging = false;
let startX;
let startY;
let animationFrame = null;

canvas.width = 600;
canvas.height = 400;

dropZone.addEventListener("click", () => {
  imageInput.click();
});

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
  if (!file || !file.type.startsWith("image/")) {
    alert("Please upload a valid image file.");
    return;
  }

  fileNameDisplay.textContent = `Selected File: ${file.name}`;

  try {
    const buffer = await file.arrayBuffer();
    const image = await Jimp.read(buffer);

    image.color([
      { apply: "red", params: [-255] },
      { apply: "green", params: [-255] },
    ]);

    image.brightness(0.6);
    image.contrast(1);

    let src = await image.getBase64("image/png");
    if (!src.startsWith("data:")) {
      src = `data:image/png;base64,${src}`;
    }
    img.src = src;
  } catch (error) {
    console.error("Error loading image:", error);
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

  const imgWidth = img.width;
  const imgHeight = img.height;
  const aspectRatio = imgWidth / imgHeight;
  let newWidth = canvas.width * scale;
  let newHeight = newWidth / aspectRatio;

  if (newHeight > canvas.height * scale) {
    newHeight = canvas.height * scale;
    newWidth = newHeight * aspectRatio;
  }

  const maxX = Math.max((newWidth - canvas.width) / 2, 0);
  const maxY = Math.max((newHeight - canvas.height) / 2, 0);

  posX = Math.min(maxX, Math.max(-maxX, posX));
  posY = Math.min(maxY, Math.max(-maxY, posY));

  const offsetX = (canvas.width - newWidth) / 2 + posX;
  const offsetY = (canvas.height - newHeight) / 2 + posY;

  ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
}

canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const zoomIntensity = 0.08;
  const zoomFactor = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;
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

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
});

canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const dx = (e.clientX - startX) * 0.6;
    const dy = (e.clientY - startY) * 0.6;

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

canvas.addEventListener("touchstart", (e) => {
  isDragging = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

canvas.addEventListener("touchmove", (e) => {
  if (isDragging) {
    const dx = (e.touches[0].clientX - startX) * 0.6;
    const dy = (e.touches[0].clientY - startY) * 0.6;
    posX += dx;
    posY += dy;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    drawImage();
  }
});

canvas.addEventListener("touchend", () => {
  isDragging = false;
});
