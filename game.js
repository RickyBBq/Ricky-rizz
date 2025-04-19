const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = { x: 50, y: 300, width: 30, height: 30, dy: 0, grounded: false };
const gravity = 0.5;
const keys = {};
const groundY = 350;
const goal = { x: 700, y: 300, width: 40, height: 50 };
let cameraX = 0;

document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");

leftBtn.addEventListener("touchstart", () => keys["ArrowLeft"] = true);
leftBtn.addEventListener("touchend", () => keys["ArrowLeft"] = false);

rightBtn.addEventListener("touchstart", () => keys["ArrowRight"] = true);
rightBtn.addEventListener("touchend", () => keys["ArrowRight"] = false);

jumpBtn.addEventListener("touchstart", () => {
  if (player.grounded) {
    player.dy = -10;
    player.grounded = false;
  }
});

function drawPlayer() {
  ctx.fillStyle = "#ff3366"; // Red player color
  ctx.fillRect(player.x - cameraX, player.y, player.width, player.height);
}

function drawGround() {
  ctx.fillStyle = "#4CAF50"; // Green ground color
  ctx.fillRect(cameraX, groundY, canvas.width + cameraX, canvas.height - groundY);
}

function drawGoal() {
  ctx.fillStyle = "gold"; // Golden goal box
  ctx.fillRect(goal.x - cameraX, goal.y, goal.width, goal.height);
}

function update() {
  if (keys["ArrowRight"] || keys["KeyD"]) player.x += 4;
  if (keys["ArrowLeft"] || keys["KeyA"]) player.x -= 4;

  if ((keys["ArrowUp"] || keys["Space"] || keys["KeyW"]) && player.grounded) {
    player.dy = -10;
    player.grounded = false;
  }

  player.dy += gravity;
  player.y += player.dy;

  if (player.y + player.height >= groundY) {
    player.y = groundY - player.height;
    player.dy = 0;
    player.grounded = true;
  }

  // Update camera to follow player only when the player moves out of the visible area
  let cameraCenter = player.x - canvas.width / 2 + player.width / 2;
  if (cameraCenter > 0) {
    cameraX = cameraCenter;
  }

  // If player reaches the goal, show the end screen
  if (
    player.x + player.width > goal.x &&
    player.x < goal.x + goal.width &&
    player.y + player.height > goal.y
  ) {
    document.getElementById("end-screen").style.display = "block";
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Translate canvas to simulate camera movement
  ctx.save();
  ctx.translate(-cameraX, 0);

  drawGround();
  drawPlayer();
  drawGoal();

  ctx.restore();

  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();
