
let f = x => x ^ 3 - x - 2; // 初期値（必要）

function parseFunction(expr) {
  return new Function("x", "return " + expr + ";");
}

function drawFunction(ctx, func) {
  ctx.beginPath();
  for (let px = 0; px <= 600; px++) {
    let x = (px - 300) / 100;
    let y = func(x);
    let py = 200 - y * 20;
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.strokeStyle = "blue";
  ctx.stroke();
}

function drawPoint(ctx, x, y, color, label = "") {
  const px = 300 + x * 100;
  const py = 200 - y * 20;
  ctx.beginPath();
  ctx.arc(px, py, 4, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  if (label) {
    ctx.font = "12px sans-serif";
    ctx.fillText(label, px + 5, py - 5);
  }
}

function drawLine(ctx, x1, y1, x2, y2, color = "gray") {
  ctx.beginPath();
  ctx.moveTo(300 + x1 * 100, 200 - y1 * 20);
  ctx.lineTo(300 + x2 * 100, 200 - y2 * 20);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function runSimulation() {
  const canvas = document.getElementById("graph");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const expr = document.getElementById("function-input").value;
  const f = parseFunction(expr);
  const df = x => (f(x + 0.0001) - f(x - 0.0001)) / 0.0002; // 数値微分

  drawFunction(ctx, f);

  const method = document.querySelector('input[name="method"]:checked').value;
  const epsilon = parseFloat(document.getElementById("epsilon").value);

  if (method === "bisection") {
    const a = parseFloat(document.getElementById("a").value);
    const b = parseFloat(document.getElementById("b").value);
    bisection(ctx, f, a, b, epsilon);
  } else {
    const x0 = parseFloat(document.getElementById("x0").value);
    newton(ctx, f, df, x0, epsilon);
  }
}

function bisection(ctx, f, a, b, epsilon) {
  let mid;
  for (let i = 0; i < 20; i++) {
    mid = (a + b) / 2;
    drawPoint(ctx, mid, f(mid), "red", "x" + i);
    drawLine(ctx, a, 0, b, 0, "orange");
    if (Math.abs(f(mid)) < epsilon) break;
    if (f(a) * f(mid) < 0) b = mid;
    else a = mid;
  }
}

function newton(ctx, f, df, x, epsilon) {
  for (let i = 0; i < 20; i++) {
    const fx = f(x);
    const dfx = df(x);
    drawPoint(ctx, x, fx, "green", "x" + i);
    const x1 = x - fx / dfx;
    drawLine(ctx, x, fx, x1, 0, "purple");
    if (Math.abs(x1 - x) < epsilon) break;
    x = x1;
  }
}

document.querySelectorAll('input[name="method"]').forEach(el => {
  el.addEventListener("change", () => {
    document.getElementById("bisection-inputs").style.display =
      el.value === "bisection" ? "inline" : "none";
    document.getElementById("newton-inputs").style.display =
      el.value === "newton" ? "inline" : "none";
  });
});
