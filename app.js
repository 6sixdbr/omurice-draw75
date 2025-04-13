const saveBtn = document.getElementById("saveBtn");
const lineWidthRange = document.getElementById("lineWidth");
const bgCanvas = document.getElementById("bgCanvas");
const drawCanvas = document.getElementById("drawCanvas");
const eraserBtn = document.getElementById("eraserBtn");
let isErasing = false;
let bgImage = new Image();
const bgCtx = bgCanvas.getContext("2d");
const ctx = drawCanvas.getContext("2d"); // 사용자 그림은 이쪽에만!

bgImage.src = "omelette.png";
bgImage.onload = function (){
    resizeCanvases();
}

let isCircleOmelette = false; // 현재 이미지가 동그란 오므라이스인지 여부

const toggleImageBtn = document.getElementById("DiOmelette");

const DiOmelette = document.getElementById("DiOmelette");

DiOmelette.addEventListener("click", function () {
  if (isCircleOmelette) {
    updateBackgroundImage("omelette.png");
    DiOmelette.textContent = "2번 오므라이스";
  } else {
    updateBackgroundImage("omelette(circle).png");
    DiOmelette.textContent = "1번 오므라이스";
  }
  isCircleOmelette = !isCircleOmelette;
});


function resizeCanvases() {
    const displayWidth = drawCanvas.clientWidth;
    const displayHeight = drawCanvas.clientHeight;
    const scale = window.devicePixelRatio || 1;

    for (const canvas of [bgCanvas, drawCanvas]) {
        canvas.width = displayWidth * scale;
        canvas.height = displayHeight * scale;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
    }

    bgCtx.setTransform(1, 0, 0, 1, 0, 0);
    bgCtx.scale(scale, scale);
    bgCtx.drawImage(bgImage, 0, 0, displayWidth, displayHeight);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(scale, scale);
    setDrawingStyle();
}

function updateBackgroundImage(src) {
    bgImage = new Image();
    bgImage.src = src;
    bgImage.onload = () => {
      resizeCanvases(); // 이미지 로드 후 배경 다시 그림
    };
  }

function setDrawingStyle() {
    ctx.strokeStyle = "red";
    ctx.lineWidth = lineWidthRange.value;
    ctx.lineCap = "round"; 
    ctx.lineJoin = "round"; 
}

function getMousePos(event) {
    const rect = drawCanvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

ctx.strokeStyle = "red";
ctx.lineWidth = 3;

lineWidthRange.addEventListener("input", function (event) {
    ctx.lineWidth = event.target.value;
});

let painting = false;

function startPainting() {
    painting = true;
}

function stopPainting() {
    painting = false;
    ctx.beginPath(); 
}

function onMouseMove(event) {
    const { x, y } = getMousePos(event);

    if (!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

drawCanvas.addEventListener("mousemove", onMouseMove);
drawCanvas.addEventListener("mousedown", startPainting);
drawCanvas.addEventListener("mouseup", stopPainting);
drawCanvas.addEventListener("mouseleave", stopPainting);

saveBtn.addEventListener("click", function () {
    saveMergedCanvas(); // 우리가 만든 저장 함수 호출
   const link = document.createElement("a");
   link.download = "omelette.png";
   link.click();
});

function getTouchPos(event) {
    const rect = drawCanvas.getBoundingClientRect();
    const touch = event.touches[0];
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
}

drawCanvas.addEventListener("touchstart", function (event) {
    event.preventDefault();
    const { x, y } = getTouchPos(event);
    painting = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
}, { passive: false }); // 👈 중요!

drawCanvas.addEventListener("touchmove", function (event) {
    event.preventDefault();
    if (!painting) return;
    const { x, y } = getTouchPos(event);
    ctx.lineTo(x, y);
    ctx.stroke();
}, { passive: false }); // 👈 중요!

drawCanvas.addEventListener("touchend", function () {
    painting = false;
    ctx.beginPath();
}, { passive: false });

drawCanvas.addEventListener("touchcancel", function () {
    painting = false;
    ctx.beginPath();
}, { passive: false });

function activateEraser() {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 20;
}

function deactivateEraser() {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1.0; 
    setDrawingStyle();
}

eraserBtn.addEventListener("click", () => {
    isErasing = !isErasing;
    if (isErasing) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 20;
        eraserBtn.textContent = "🖍️";
    } else {
        ctx.globalCompositeOperation = "source-over";
        setDrawingStyle();
        eraserBtn.textContent = "지우개";
    }
});

function saveMergedCanvas() {
    const mergedCanvas = document.createElement("canvas");
    const width = bgCanvas.width;
    const height = bgCanvas.height;

    mergedCanvas.width = width;
    mergedCanvas.height = height;

    const mergedCtx = mergedCanvas.getContext("2d");
    mergedCtx.drawImage(bgCanvas, 0, 0);
    mergedCtx.drawImage(drawCanvas, 0, 0);

    const image = mergedCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "omelette.png";
    link.click();
}
