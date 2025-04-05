const canvas = document.getElementById('clockCanvas');
const ctx = canvas.getContext('2d');

const cols = 10;
const rows = 6;
const spacing = 70;
const clockRadius = 25;

const hourLength = clockRadius * 0.5;
const minuteLength = clockRadius * 0.85;

canvas.width = cols * spacing;
canvas.height = rows * spacing;

// Clock directions
const directions = {
  UP: -Math.PI / 2,
  DOWN: Math.PI / 2,
  LEFT: Math.PI,
  RIGHT: 0,
  DIAG1: -Math.PI / 4,
  DIAG2: -3 * Math.PI / 4,
  DIAG3: Math.PI / 4,
  DIAG4: (3 * Math.PI) / 4,
  EMPTY: null
};

// Digit patterns using 3x5 matrix (centered in 4x5 grid)
const digitPatterns = {
  0: [
    [[directions.UP, directions.RIGHT], [directions.UP, directions.LEFT], [directions.UP, directions.RIGHT], [directions.UP, directions.LEFT]],
    [[directions.LEFT, directions.DOWN], null, null, [directions.RIGHT, directions.DOWN]],
    [[directions.LEFT, directions.UP], null, null, [directions.RIGHT, directions.UP]],
    [[directions.LEFT, directions.DOWN], null, null, [directions.RIGHT, directions.DOWN]],
    [[directions.DOWN, directions.RIGHT], [directions.DOWN, directions.LEFT], [directions.DOWN, directions.RIGHT], [directions.DOWN, directions.LEFT]]
  ],
  1: [
    [null, [directions.DOWN, directions.DOWN], null, null],
    [null, [directions.DOWN, directions.DOWN], null, null],
    [null, [directions.DOWN, directions.DOWN], null, null],
    [null, [directions.DOWN, directions.DOWN], null, null],
    [null, [directions.DOWN, directions.DOWN], null, null]
  ],
  2: [
    [[directions.UP, directions.RIGHT], [directions.UP, directions.LEFT], [directions.UP, directions.RIGHT], [directions.UP, directions.LEFT]],
    [null, null, null, [directions.RIGHT, directions.DOWN]],
    [[directions.UP, directions.RIGHT], [directions.UP, directions.LEFT], [directions.UP, directions.RIGHT], [directions.UP, directions.LEFT]],
    [[directions.LEFT, directions.DOWN], null, null, null],
    [[directions.DOWN, directions.RIGHT], [directions.DOWN, directions.LEFT], [directions.DOWN, directions.RIGHT], [directions.DOWN, directions.LEFT]]
  ],
  3: [
    [[directions.UP, directions.RIGHT], [directions.UP, directions.LEFT], [directions.UP, directions.RIGHT], [directions.UP, directions.LEFT]],
    [null, null, null, [directions.RIGHT, directions.DOWN]],
    [[directions.UP, directions.RIGHT], [directions.UP, directions.LEFT], [directions.UP, directions.RIGHT], [directions.UP, directions.LEFT]],
    [null, null, null, [directions.RIGHT, directions.DOWN]],
    [[directions.DOWN, directions.RIGHT], [directions.DOWN, directions.LEFT], [directions.DOWN, directions.RIGHT], [directions.DOWN, directions.LEFT]]
  ],
  4: [
    [[directions.LEFT, directions.DOWN], null, null, [directions.RIGHT, directions.DOWN]],
    [[directions.LEFT, directions.UP], null, null, [directions.RIGHT, directions.UP]],
    [[directions.UP, directions.RIGHT], [directions.UP, directions.LEFT], [directions.UP, directions.RIGHT], [directions.UP, directions.LEFT]],
    [null, null, null, [directions.RIGHT, directions.DOWN]],
    [null, null, null, [directions.RIGHT, directions.DOWN]]
  ],
  5: [
    [[directions.UP, directions.RIGHT], [directions.UP, directions.LEFT], [directions.UP, directions.RIGHT], [directions.UP, directions.LEFT]],
    [[directions.LEFT, directions.DOWN], null, null, null],
    [[directions.UP, directions.RIGHT], [directions.UP, directions.LEFT], [directions.UP, directions.RIGHT], [directions.UP, directions.LEFT]],
    [null, null, null, [directions.RIGHT, directions.DOWN]],
    [[directions.DOWN, directions.RIGHT], [directions.DOWN, directions.LEFT], [directions.DOWN, directions.RIGHT], [directions.DOWN, directions.LEFT]]
  ],
  6: [
    [[directions.UP, directions.RIGHT], [directions.UP, directions.LEFT], [directions.UP, directions.RIGHT], [directions.UP, directions.LEFT]],
    [[directions.LEFT, directions.DOWN], null, null, null],
    [[directions.UP, directions.RIGHT], [directions.UP, directions.LEFT], [directions.UP, directions.RIGHT], [directions.UP, directions.LEFT]],
    [[directions.LEFT, directions.DOWN], null, null, [directions.RIGHT, directions.DOWN]],
    [[directions.DOWN, directions.RIGHT], [directions.DOWN, directions.LEFT], [directions.DOWN, directions.RIGHT], [directions.DOWN, directions.LEFT]]
  ],
  7: [
    [[directions.UP, directions.RIGHT], [directions.UP, directions.LEFT], [directions.UP, directions.RIGHT], [directions.UP, directions.LEFT]],
    [null, null, null, [directions.RIGHT, directions.DOWN]],
    [null, null, [directions.RIGHT, directions.DOWN], null],
    [null, [directions.RIGHT, directions.DOWN], null, null],
    [[directions.RIGHT, directions.DOWN], null, null, null]
  ],
  8: [
    [[directions.UP, directions.RIGHT], [directions.UP, directions.LEFT], [directions.UP, directions.RIGHT], [directions.UP, directions.LEFT]],
    [[directions.LEFT, directions.DOWN], null, null, [directions.RIGHT, directions.DOWN]],
    [[directions.UP, directions.RIGHT], [directions.UP, directions.LEFT], [directions.UP, directions.RIGHT], [directions.UP, directions.LEFT]],
    [[directions.LEFT, directions.DOWN], null, null, [directions.RIGHT, directions.DOWN]],
    [[directions.DOWN, directions.RIGHT], [directions.DOWN, directions.LEFT], [directions.DOWN, directions.RIGHT], [directions.DOWN, directions.LEFT]]
  ],
  9: [
    [[directions.UP, directions.RIGHT], [directions.UP, directions.LEFT], [directions.UP, directions.RIGHT], [directions.UP, directions.LEFT]],
    [[directions.LEFT, directions.DOWN], null, null, [directions.RIGHT, directions.DOWN]],
    [[directions.UP, directions.RIGHT], [directions.UP, directions.LEFT], [directions.UP, directions.RIGHT], [directions.UP, directions.LEFT]],
    [null, null, null, [directions.RIGHT, directions.DOWN]],
    [[directions.DOWN, directions.RIGHT], [directions.DOWN, directions.LEFT], [directions.DOWN, directions.RIGHT], [directions.DOWN, directions.LEFT]]
  ]
};

// Initialize grid of clocks
let clocks = [];

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    clocks.push({
      x: col * spacing + spacing / 2,
      y: row * spacing + spacing / 2,
      hourAngle: Math.random() * 2 * Math.PI,
      minuteAngle: Math.random() * 2 * Math.PI,
      targetHour: null,
      targetMinute: null,
      fixed: false
    });
  }
}

function drawClock(ctx, x, y, radius, hourAngle, minuteAngle) {
  ctx.save();
  ctx.translate(x, y);

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (hourAngle !== null) {
    ctx.save();
    ctx.rotate(hourAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -hourLength);
    ctx.strokeStyle = '#00f6ff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  if (minuteAngle !== null) {
    ctx.save();
    ctx.rotate(minuteAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -minuteLength);
    ctx.strokeStyle = '#00f6ff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

function animateClocks() {
  for (const clock of clocks) {
    if (!clock.fixed) {
      if (Math.random() < 0.01) {
        clock.targetHour = Math.random() * 2 * Math.PI;
        clock.targetMinute = Math.random() * 2 * Math.PI;
      }

      if (clock.targetHour !== null) {
        clock.hourAngle += (clock.targetHour - clock.hourAngle) * 0.1;
        if (Math.abs(clock.hourAngle - clock.targetHour) < 0.01) {
          clock.targetHour = null;
        }
      }

      if (clock.targetMinute !== null) {
        clock.minuteAngle += (clock.targetMinute - clock.minuteAngle) * 0.1;
        if (Math.abs(clock.minuteAngle - clock.targetMinute) < 0.01) {
          clock.targetMinute = null;
        }
      }
    }
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  animateClocks();
  for (const clock of clocks) {
    drawClock(ctx, clock.x, clock.y, clockRadius, clock.hourAngle, clock.minuteAngle);
  }
  requestAnimationFrame(render);
}

function renderDigit(digit, startRow, startCol) {
  const pattern = digitPatterns[digit];
  if (!pattern) return;

  for (let r = 0; r < pattern.length; r++) {
    for (let c = 0; c < pattern[r].length; c++) {
      const angles = pattern[r][c];
      const clockIndex = (startRow + r) * cols + (startCol + c);
      if (clocks[clockIndex] && angles) {
        clocks[clockIndex].hourAngle = angles[0];
        clocks[clockIndex].minuteAngle = angles[1];
        clocks[clockIndex].fixed = true;
      }
    }
  }
}

// Example: show digits
renderDigit(1, 0, 0);
renderDigit(2, 0, 5);
renderDigit(3, 0, 8);

render(); // Start animation loop
