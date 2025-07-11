const saveBtn = document.getElementById("saveBtn");//저장 버튼
const lineWidthRange = document.getElementById("lineWidth");//펜의 굵기 조절 바
const bgCanvas = document.getElementById("bgCanvas");//오므라이스 배경 이미지 레이어
const drawCanvas = document.getElementById("drawCanvas");//사용자 그림 레이어
const eraserBtn = document.getElementById("eraserBtn");//지우기 버튼
const bgCtx = bgCanvas.getContext("2d");
const ctx = drawCanvas.getContext("2d");//사용자 그림은 여기에
const turnoverBtn = document.getElementById("turnoverBtn");//사용자 그림 전체 지우기 버튼
const openMenuBtn = document.getElementById("openMenuBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const menuModal = document.getElementById("menuModal");
const menuOptions = document.querySelectorAll(".menu-options img");
const modal = document.getElementById("menuModal");
const closeBtn = document.getElementById("closeMenuBtn");

let isErasing = false;
let bgImage = new Image();

bgImage.src = "omelette.png";
bgImage.onload = function (){
    resizeCanvases();
}

let isCircleOmelette = false; // 현재 이미지 동그란 오므라이스인가?

document.addEventListener("DOMContentLoaded", () => {
    // 버튼 클릭 이벤트 여기서 설정
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
        if (isErasing) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = lineWidthRange.value;
        } else {
            ctx.globalCompositeOperation ="source-over";
            ctx.lineWidth = lineWidthRange.value;
        }
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
}, { passive: false }); 

drawCanvas.addEventListener("touchmove", function (event) {
    event.preventDefault();
    if (!painting) return;
    const { x, y } = getTouchPos(event);
    ctx.lineTo(x, y);
    ctx.stroke();
}, { passive: false }); 

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
        eraserBtn.textContent = "『🧽』 ▶ 🖍️";
        drawCanvas.style.cursor = "url('mayo-cursor-b.png') 0 26 , auto";
    } else {
        eraserBtn.textContent = "『🖍️』 ▶ 🧽";
        drawCanvas.style.cursor = "url('pen-cursor.png') 0 26, auto";
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "m" || event.key === "M" || event.key === "ㅡ") {
      // 지우개 모드로 전환
      isErasing = true;
      eraserBtn.textContent = "『🧽』 ▶ 🖍️";
      drawCanvas.style.cursor = "url('mayo-cursor-b.png') 0 26, auto";
    }

    if (event.key === "k" || event.key === "K" || event.key === "ㅏ") {
      // 펜 모드로 전환
      isErasing = false;
      eraserBtn.textContent = "『🖍️』 ▶ 🧽";
      drawCanvas.style.cursor = "url('pen-cursor.png') 0 26, auto";
    }
  });

turnoverBtn.addEventListener("click", () => 
    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height));

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

openMenuBtn.addEventListener("click", () => {
  menuModal.classList.remove("hidden");
});

closeMenuBtn.addEventListener("click", () => {
  menuModal.classList.add("hidden");
});

menuOptions.forEach(img => {
  img.addEventListener("click", () => {
    const selected = img.dataset.src;
    updateBackgroundImage(selected); // 기존 함수 활용
    menuModal.classList.add("hidden");
  });
});

closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
  
  // 바깥 영역 클릭 시 모달 닫기
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // ID 목록
  const menuIds = [1, 2]; // 메뉴 수에 따라 확장 가능

  menuIds.forEach(id => {
    const input = document.getElementById(`priceInput-${id}`);
  
    // 저장된 데이터 불러오기
    const saved = localStorage.getItem(`price-${id}`);
    if (saved !== null) {
      input.value = saved;
    }
  
    // 입력할 때마다 저장 (문자든 숫자든 가능)
    input.addEventListener("input", () => {
      localStorage.setItem(`price-${id}`, input.value);
    });
  });

  
function startPainting() {
  saveState(); // 새로운 그리기 시작 전에 저장
  painting = true;
}

  const undoStack = [];

function saveState() {
  undoStack.push(ctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height));
  if (undoStack.length > 5) {
    undoStack.shift(); // 너무 많아지면 가장 오래된 건 제거
  }
}

document.addEventListener("keydown", function (event) {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const undoKeyPressed =
      (isMac && event.metaKey && event.key === "z") ||
      (!isMac && event.ctrlKey && event.key === "z");
  
    if (undoKeyPressed) {
      event.preventDefault(); // 기본 동작 방지
      undoLastStroke();
    }
  });
  
  function undoLastStroke() {
    if (undoStack.length > 0) {
      const prev = undoStack.pop();
      ctx.putImageData(prev, 0, 0);
    }
  }

