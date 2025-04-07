const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const saveBtn = document.getElementById("saveBtn");
const lineWidthRange = document.getElementById("lineWidth");


canvas.width = 700;
canvas.height = 700;

const bgImage = new Image();
bgImage.src = "omelette(aimg).jpg";

bgImage.onload = function () {
ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
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
    ctx.beginPath(); // 선이 끊어지도록 초기화
}

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
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