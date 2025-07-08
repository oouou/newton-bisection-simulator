
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

function bisectionAnimate(ctx, a, b, epsilon, step = 0) {
  if (step >= 20) return;
  const mid = (a + b) / 2;
  drawPoint(ctx, mid, "red");
  if (Math.abs(f(mid)) < epsilon) return;
  if (f(a) * f(mid) < 0) b = mid;
  else a = mid;
  setTimeout(() => {
    bisectionAnimate(ctx, a, b, epsilon, step + 1);
  }, 500);
}

function newtonAnimate(ctx, x, epsilon, step = 0) {
  if (step >= 20) return;
  drawPoint(ctx, x, "green");
  const x1 = x - f(x) / df(x);
  if (Math.abs(x1 - x) < epsilon) return;
  setTimeout(() => {
    newtonAnimate(ctx, x1, epsilon, step + 1);
  }, 500);
}

document.querySelectorAll('input[name="method"]').forEach(el => {
  el.addEventListener("change", () => {
    document.getElementById("bisection-inputs").style.display =
      el.value === "bisection" ? "inline" : "none";
    document.getElementById("newton-inputs").style.display =
      el.value === "newton" ? "inline" : "none";
  });
});

