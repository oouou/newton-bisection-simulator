
let f = x => x ** 3 - x - 2; // 初期値（必要）

function runSimulation() {
  const canvas = document.getElementById("graph");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 関数式を取得して文字列から関数へ変換
  const funcStr = document.getElementById("functionInput").value;
  try {
    f = new Function("x", `return ${funcStr};`);
  } catch (e) {
    alert("関数の入力に誤りがあります");
    return;
  }

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

function df(x) {
  const h = 0.0001;
  return (f(x + h) - f(x - h)) / (2 * h);
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

function bisectionAnimate(ctx, a, b, epsilon, i = 0) {
  if (i > 20) return;
  let mid = (a + b) / 2;
  drawPoint(ctx, mid, "red");
  if (Math.abs(f(mid)) < epsilon) return;
  setTimeout(() => {
    if (f(a) * f(mid) < 0) {
      bisectionAnimate(ctx, a, mid, epsilon, i + 1);
    } else {
      bisectionAnimate(ctx, mid, b, epsilon, i + 1);
    }
  }, 1000);
}

function newtonAnimate(ctx, x, epsilon, i = 0) {
  if (i > 20) return;
  drawPoint(ctx, x, "green");
  let slope = df(x);
  let intercept = f(x) - slope * x;
  drawLine(ctx, x - 1, slope * (x - 1) + intercept, x + 1, slope * (x + 1) + intercept, "orange");

  let x1 = x - f(x) / df(x);
  if (Math.abs(x1 - x) < epsilon) return;
  setTimeout(() => newtonAnimate(ctx, x1, epsilon, i + 1), 1000);
}

function drawLine(ctx, x1, y1, x2, y2, color) {
  ctx.beginPath();
  ctx.moveTo(300 + x1 * 100, 200 - y1 * 20);
  ctx.lineTo(300 + x2 * 100, 200 - y2 * 20);
  ctx.strokeStyle = color;
  ctx.stroke();
}

document.querySelectorAll('input[name="method"]').forEach(el => {
  el.addEventListener("change", () => {
    document.getElementById("bisection-inputs").style.display =
      el.value === "bisection" ? "inline" : "none";
    document.getElementById("newton-inputs").style.display =
      el.value === "newton" ? "inline" : "none";
  });
});
