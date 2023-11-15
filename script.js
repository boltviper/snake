document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("gameCanvas");
  const context = canvas.getContext("2d");

  const gridSize = 20;
  let snake = [{ x: 5, y: 5 }];
  let food = { x: 10, y: 10 };
  let direction = "right";
  let isGameOver = false;
  let score = 0; // Scoretæller

  let obstacles = [
    { x: 8, y: 8 },
    { x: 12, y: 5 },
    // Tilføj flere forhindringer her
  ];

  function update() {
    if (isGameOver) return;

    const newHead = { x: snake[0].x, y: snake[0].y };

    if (direction === "up") newHead.y -= 1;
    if (direction === "down") newHead.y += 1;
    if (direction === "left") newHead.x -= 1;
    if (direction === "right") newHead.x += 1;

    snake.unshift(newHead);

    if (newHead.x < 0 || newHead.x >= canvas.width / gridSize ||
        newHead.y < 0 || newHead.y >= canvas.height / gridSize) {
      gameOver();
      return;
    }

    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
        gameOver();
        return;
      }
    }

    for (let i = 0; i < obstacles.length; i++) {
      if (newHead.x === obstacles[i].x && newHead.y === obstacles[i].y) {
        gameOver();
        return;
      }
    }

    if (newHead.x === food.x && newHead.y === food.y) {
      generateFood();
      score += 1; // Øg scoren når føde spises
    } else {
      snake.pop();
    }

    draw();
  }

  function draw() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "lime";
    snake.forEach(segment => {
      context.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    context.fillStyle = "red";
    context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    context.fillStyle = "gray"; // Farven på forhindringerne
    obstacles.forEach(obstacle => {
      context.fillRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize, gridSize);
    });

    // Tegn scoren
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 10, 30);
  }

  function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize));
    food.y = Math.floor(Math.random() * (canvas.height / gridSize));
  }

  function gameOver() {
    isGameOver = true;
    alert("Game Over! Score: " + score + "\nPress any key to restart.");
    document.addEventListener("keydown", restartGame);
  }

  function restartGame() {
    isGameOver = false;
    snake = [{ x: 5, y: 5 }];
    direction = "right";
    score = 0; // Nulstil scoren
    generateFood();
    document.removeEventListener("keydown", restartGame);
  }

  document.addEventListener("keydown", event => {
    if (!isGameOver) {
      if (event.key === "ArrowUp" && direction !== "down") direction = "up";
      if (event.key === "ArrowDown" && direction !== "up") direction = "down";
      if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
      if (event.key === "ArrowRight" && direction !== "left") direction = "right";
    }
  });

  generateFood();
  setInterval(update, 100);
});