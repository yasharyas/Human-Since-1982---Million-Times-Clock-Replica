const canvas = document.getElementById('clockCanvas');
const ctx = canvas.getContext('2d');

const cols = 10;
const rows = 6;
const spacing = 80;
const clockRadius = 20;

canvas.width = cols * spacing;
canvas.height = rows * spacing;


// Initialize grid of clocks
let clocks = [];

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    clocks.push({
      x: col * spacing + spacing / 2,
      y: row * spacing + spacing / 2,
      hourAngle: Math.random() * 2 * Math.PI,
      minuteAngle: Math.random() * 2 * Math.PI,
    });
  }
}

function drawClock(ctx, x, y, radius, hourAngle, minuteAngle) {
  ctx.save();
  ctx.translate(x, y);

  // Draw clock circle
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Hour hand
  ctx.save();
  ctx.rotate(hourAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -radius * 0.6);
  ctx.strokeStyle = '#00f6ff';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // Minute hand
  ctx.save();
  ctx.rotate(minuteAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -radius * 0.9);
  ctx.strokeStyle = '#00f6ff';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const clock of clocks) {
    drawClock(ctx, clock.x, clock.y, clockRadius, clock.hourAngle, clock.minuteAngle);
  }

  requestAnimationFrame(render);
}

render();
