const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const saveBtn = document.getElementById("saveBtn");
const lineWidthRange = document.getElementById("lineWidth");

const bgImage = new Image();
bgImage.src = "omelette(aimg).jpg";

function resizeCanvas() {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const scale = window.devicePixelRatio || 1;

    canvas.width = displayWidth * scale;
    canvas.height = displayHeight * scale;

    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // 🔥 그리기 좌표계 스케일 조정
    ctx.setTransform(1, 0, 0, 1, 0, 0); // 초기화
    ctx.scale(scale, scale); // 확대 적용

    // ✅ 배경 이미지는 display 크기에 맞춰 그림!
    ctx.drawImage(bgImage, 0, 0, displayWidth, displayHeight);

    setDrawingStyle();
}


function setDrawingStyle() {
    ctx.strokeStyle = "red";
    ctx.lineWidth = lineWidthRange.value;
}

function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

bgImage.onload = function () {
    resizeCanvas();
};

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

canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", stopPainting);
canvas.addEventListener("mouseleave", stopPainting);

saveBtn.addEventListener("click", function () {
   const image = canvas.toDataURL("image/png");
   const link = document.createElement("a");
   link.href = image;
   link.download = "my_drawing.png";
   link.click();
});

function getTouchPos(event) {
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
}

canvas.addEventListener("touchstart", function (event) {
    event.preventDefault();
    const { x, y } = getTouchPos(event);
    painting = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
}, { passive: false }); // 👈 중요!

canvas.addEventListener("touchmove", function (event) {
    event.preventDefault();
    if (!painting) return;
    const { x, y } = getTouchPos(event);
    ctx.lineTo(x, y);
    ctx.stroke();
}, { passive: false }); // 👈 중요!

canvas.addEventListener("touchend", function () {
    painting = false;
    ctx.beginPath();
}, { passive: false });

canvas.addEventListener("touchcancel", function () {
    painting = false;
    ctx.beginPath();
}, { passive: false });


canvas.addEventListener("touchcancel", function () {
    painting = false;
    ctx.beginPath();
}, { passive: false });
