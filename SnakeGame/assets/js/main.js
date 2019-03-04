const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let primary = "#AF1E2D";
let secondary = "#FFCE00";

const grid = 32; // Size of each cell in the grid
let count = 0; // To set framerate of the game
let score = 0;

let snake = {
    x: grid * 5, // Where it starts on the grid 165 x 32 = 160
    y: grid * 5, // 165 x 32 = 160
    
    vx: grid,  // Velocity
    vy: 0,     // Initial Y velocity is 0

    cells: [], // X and Y of each cell will be put here

    maxCells: 4 // Initial length of snake
};

let apple = { // Apple size 
    x: grid * 10,   // 320
    y: grid * 10    // 320 
}

function Update() {
    // Because every time requestAnimationFrame(Update); runs we want to run it again
    requestAnimationFrame(Update);

    // To reduce FPS    
    if (++count < 6) {
        return;
    }
    count = 0;

    // Clear the canvas before generating next image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
   
    // This is for the snake to move
    // The snake moves one unit every frame
    // New position = Initial Position + Velocity
    snake.x += snake.vx;
    snake.y += snake.vy;

    // Looping
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.width) {
        snake.y = 0;
    }


    // Create and destroy blocks
    // To create cells
    // Passing through an object
    // The unshift() method adds new items to the beginning of an array, and returns the new length.
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // If length of snake is more than maxCells, Reduce the length, Remove last cell
    if (snake.cells.length > snake.maxCells) { 
        snake.cells.pop(); // Removes last element from Array and returns it   
    }

    ctx.fillStyle = secondary;
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);  //-1 for gap between blocks

    // primary is the fillStyle for snake
    ctx.fillStyle = primary;
    snake.cells.forEach(function (cell, index) {
        // cell.x = snake.x, cell.y = snake.y
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);  //-1 for gap between blocks
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score++;
            apple.x = getRandomInt(0, 24) * grid; // 24 because that 768/32 
            apple.y = getRandomInt(0, 14) * grid; //
        }

        for (let i = index + 1; i < snake.cells.length; i++){
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                window.location.reload();
                // If head touches any part of snake
            }
        }
    });

    // Score

    ctx.font = "42px Helvetica";
    ctx.fillStyle = "#rgba(255,255,255,0.5)";
    ctx.textAlign = "center";
    ctx.fillText(score, canvas.width / 2, canvas.height / 2);

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;    
}

document.addEventListener("keydown", function (evt) {
    if (evt.which === 37 && snake.vx === 0) { // 37 is <-
        snake.vx = -grid;
        snake.vy = 0;
    } else if(evt.which === 38 && snake.vy === 0) { // 38 is ^
        snake.vy = -grid;
        snake.vx = 0;
    } else if(evt.which === 39 && snake.vx === 0) { // 39 is >
        snake.vx = grid;
        snake.vy = 0;
    } else if (evt.which === 40 && snake.vy === 0) { // 40 is down
        snake.vy = grid;
        snake.vx = 0;
    }
});

// Starts the game
requestAnimationFrame(Update);

// Use local storage to store Score