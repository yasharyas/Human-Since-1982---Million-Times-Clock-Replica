// Create canvas element and append to document
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Set up full-screen canvas
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.style.backgroundColor = '#000';

// Define grid layout
const GRID_COLS = 12;
const GRID_ROWS = 8;
const TIME_MULTIPLIER = 1000; // Speed up animation

// Initialize custom start time
let customTime = new Date();
customTime.setHours(12, 0, 0, 0); // Set to 12:00:00 initially


// Resize canvas to fill window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Draw a clock face and hands


function drawClock(x, y, radius, time) {
    ctx.save();
    ctx.translate(x, y);
    
    // Clock face
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#f0f0f0';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = radius * 0.02;
    ctx.stroke();
    
    // Remove hour marks (if any)

    // Calculate hand angles
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const ms = time.getMilliseconds();
    
    const hourAngle = (hours * Math.PI / 6) + 
                      (minutes * Math.PI / (6 * 60)) + 
                      (seconds * Math.PI / (360 * 60));
    const minuteAngle = (minutes * Math.PI / 30) + 
                        (seconds * Math.PI / (30 * 60)) + 
                        (ms * Math.PI / (30 * 60 * 1000));

    // Hour hand (rectangular needle, same size as minute hand)
    ctx.save();
    ctx.rotate(hourAngle);
    ctx.fillStyle = '#000';
    ctx.fillRect(-radius * 0.02, -radius * 0.75, radius * 0.04, radius * 0.75); // Rectangular hand
    ctx.restore();

    // Minute hand (rectangular needle, same size as hour hand)
    ctx.save();
    ctx.rotate(minuteAngle);
    ctx.fillStyle = '#000';
    ctx.fillRect(-radius * 0.02, -radius * 0.75, radius * 0.04, radius * 0.75); // Rectangular hand
    ctx.restore();

    ctx.restore();
}

// Animation loop
function updateClocks() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Increment custom time
    customTime = new Date(customTime.getTime() + TIME_MULTIPLIER);

    // Calculate clock dimensions
    const clockWidth = canvas.width / GRID_COLS;
    const clockHeight = canvas.height / GRID_ROWS;
    const clockSize = Math.min(clockWidth, clockHeight);
    const radius = clockSize * 0.4;
    
    // Draw grid of clocks
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const x = (col + 0.5) * clockWidth;
            const y = (row + 0.5) * clockHeight;
            drawClock(x, y, radius, customTime);
        }
    }
    
    requestAnimationFrame(updateClocks);
}

// Start animation
updateClocks();