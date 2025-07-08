
function runSimulation() {
  const canvas = document.getElementById("graph");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFunction(ctx);

  const method = document.querySelector('input[name="method"]:checked').value;
  const epsilon = parseFloat(document.getElementById("epsilon").value);

  if (method === "bisection") {
    let a = parseFloat(document.getElementById("a").value);
    let b = parseFloat(document.getElementById("b").value);
    bisectionAnimate(ctx, a, b, epsilon);
  } else {
    let x0 = parseFloat(document.getElementById("x0").value);
    newtonAnimate(ctx, x0, epsilon);
  }
}

function drawFunction(ctx) {
  ctx.beginPath();
  for (let px = 0; px <= 600; px++) {
    let x = (px - 300) / 100;
    let y = f(x);
    let py = 200 - y * 20;
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.strokeStyle = "blue";
  ctx.stroke();
}

function drawPoint(ctx, x, color) {
  ctx.beginPath();
  ctx.arc(300 + x * 100, 200 - f(x) * 20, 5, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawLabel(ctx, x, label) {
  ctx.fillStyle = "black";
  ctx.font = "12px sans-serif";
  ctx.fillText(label, 300 + x * 100 + 5, 200 - f(x) * 20 - 10);
}

function drawTangentLine(ctx, x) {
  const slope = df(x);
  const y = f(x);
  const x1 = x - 1, x2 = x + 1;
  const y1 = y + slope * (x1 - x);
  const y2 = y + slope * (x2 - x);

  ctx.beginPath();
  ctx.moveTo(300 + x1 * 100, 200 - y1 * 20);
  ctx.lineTo(300 + x2 * 100, 200 - y2 * 20);
  ctx.strokeStyle = "orange";
  ctx.setLineDash([5, 3]);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawInterval(ctx, a, b) {
  const ax = 300 + a * 100;
  const bx = 300 + b * 100;
  ctx.beginPath();
  ctx.moveTo(ax, 200);
  ctx.lineTo(bx, 200);
  ctx.strokeStyle = "purple";
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);
}

// アニメーション付きニュートン法
function newtonAnimate(ctx, x, epsilon) {
  let step = 0;

  function stepFunc() {
    drawPoint(ctx, x, "green");
    drawLabel(ctx, x, "x" + step);
    drawTangentLine(ctx, x);

    let x1 = x - f(x) / df(x);
    if (Math.abs(x1 - x) < epsilon || step >= 20) return;

    step++;
    x = x1;
    setTimeout(stepFunc, 1000);
  }

  stepFunc();
}

// アニメーション付き2分法
function bisectionAnimate(ctx, a, b, epsilon) {
  let step = 0;

  function stepFunc() {
    let mid = (a + b) / 2;
    drawInterval(ctx, a, b);
    drawPoint(ctx, mid, "red");
    drawLabel(ctx, mid, "x" + step);

    if (Math.abs(f(mid)) < epsilon || step >= 20) return;

    if (f(a) * f(mid) < 0) b = mid;
    else a = mid;

    step++;
    setTimeout(stepFunc, 1000);
  }

  stepFunc();
}

// メソッド選択時の入力欄表示切替
document.querySelectorAll('input[name="method"]').forEach(el => {
  el.addEventListener("change", () => {
    document.getElementById("bisection-inputs").style.display =
      el.value === "bisection" ? "inline" : "none";
    document.getElementById("newton-inputs").style.display =
      el.value === "newton" ? "inline" : "none";
  });
});
