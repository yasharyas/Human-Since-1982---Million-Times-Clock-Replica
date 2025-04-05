const canvas = document.getElementById('clockCanvas');
const ctx = canvas.getContext('2d');

// Grid & Clock Setup
const cols = 10;
const rows = 6;
const spacing = 70; // Slightly tighter
const clockRadius = 25;

const hourLength = clockRadius * 0.6;
const minuteLength = clockRadius * 0.9;

canvas.width = cols * spacing;
canvas.height = rows * spacing;

// Directions
const directions = {
  UP: -Math.PI / 2,
  DOWN: Math.PI / 2,
  LEFT: Math.PI,
  RIGHT: 0,
  DIAG1: -Math.PI / 4,
  DIAG2: -3 * Math.PI / 4,
  EMPTY: null
};

// Pattern for digit '1'
const digitPatterns = {
  1: [
    [null, null, null],
    [null, [directions.DOWN, directions.DOWN], null],
    [null, [directions.DOWN, directions.DOWN], null],
    [null, [directions.DOWN, directions.DOWN], null],
    [null, [directions.DOWN, directions.DOWN], null],
  ],
};

// Clock Grid
let clocks = [];

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    clocks.push({
      x: col * spacing + spacing / 2,
      y: row * spacing + spacing / 2,
      hourAngle: Math.random() * 2 * Math.PI,
      minuteAngle: Math.random() * 2 * Math.PI,
      targetHour: Math.random() * 2 * Math.PI,
      targetMinute: Math.random() * 2 * Math.PI,
    });
  }
}

// Draw a single clock
function drawClock(ctx, x, y, radius, hourAngle, minuteAngle) {
  ctx.save();
  ctx.translate(x, y);

  // Clock circle
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Hour hand
  if (hourAngle !== null) {
    ctx.save();
    ctx.rotate(hourAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -hourLength);
    ctx.strokeStyle = '#00f6ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  // Minute hand
  if (minuteAngle !== null) {
    ctx.save();
    ctx.rotate(minuteAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -minuteLength);
    ctx.strokeStyle = '#00f6ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// Smooth interpolate between angles
function lerpAngle(a, b, t) {
  const diff = Math.atan2(Math.sin(b - a), Math.cos(b - a));
  return a + diff * t;
}

// Update & Render
function animateClocks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const clock of clocks) {
    // Animate toward target
    clock.hourAngle = lerpAngle(clock.hourAngle, clock.targetHour, 0.1);
    clock.minuteAngle = lerpAngle(clock.minuteAngle, clock.targetMinute, 0.1);

    drawClock(ctx, clock.x, clock.y, clockRadius, clock.hourAngle, clock.minuteAngle);
  }

  requestAnimationFrame(animateClocks);
}

// Render digit pattern (example: 1)
function renderDigit(digit, startRow, startCol) {
  const pattern = digitPatterns[digit];
  if (!pattern) return;

  for (let r = 0; r < pattern.length; r++) {
    for (let c = 0; c < pattern[r].length; c++) {
      const angles = pattern[r][c];
      const clockIndex = (startRow + r) * cols + (startCol + c);
      if (angles && clocks[clockIndex]) {
        clocks[clockIndex].targetHour = angles[0];
        clocks[clockIndex].targetMinute = angles[1];
      }
    }
  }
}

// Randomize clocks (except those showing digits)
function randomizeClocks() {
  for (const clock of clocks) {
    if (clock.targetHour === undefined || clock.targetMinute === undefined) {
      clock.targetHour = Math.random() * 2 * Math.PI;
      clock.targetMinute = Math.random() * 2 * Math.PI;
    }
  }
}

// Optional: convert real time to angles (24-hour support)
function setClockTime(clock, hour, minute) {
  const hourAngle = ((hour % 12) + minute / 60) * (Math.PI / 6); // 30° per hour
  const minuteAngle = (minute / 60) * 2 * Math.PI;
  clock.targetHour = hourAngle;
  clock.targetMinute = minuteAngle;
}

// Example: auto sync specific clock to real time
function syncClockWithRealTime(clockIndex) {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  setClockTime(clocks[clockIndex], hour, minute);
}

// INIT
renderDigit(1, 0, 0); // Draw digit '1' at top-left
randomizeClocks();     // Animate everything else
syncClockWithRealTime(59); // Pick a random clock to show current time

animateClocks();       // Start animation
