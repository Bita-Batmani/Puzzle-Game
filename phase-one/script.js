// Initialize the matrix with numbers 1-8 and 0 for the empty space
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0],
];

// Function to shuffle the matrix
function shuffleMatrix(matrix) {
  let shuffled = matrix.flat();
  do {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (!isSolvable(shuffled));
  return [
    [shuffled[0], shuffled[1], shuffled[2]],
    [shuffled[3], shuffled[4], shuffled[5]],
    [shuffled[6], shuffled[7], shuffled[8]],
  ];
}

// Function to check if the puzzle is solvable
function isSolvable(shuffled) {
  let inversions = 0;
  for (let i = 0; i < shuffled.length; i++) {
    for (let j = i + 1; j < shuffled.length; j++) {
      if (shuffled[i] > shuffled[j] && shuffled[i] != 0 && shuffled[j] != 0) {
        inversions++;
      }
    }
  }
  // A solvable puzzle has an even number of inversions
  return inversions % 2 === 0;
}

// Function to find the position of 0 (empty space)
function findEmptySpace(matrix) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] === 0) {
        return { row, col };
      }
    }
  }
}

// Functions to move the empty space
function move(matrix, direction) {
  let { row, col } = findEmptySpace(matrix);
  switch (direction) {
    case "up":
      if (row > 0) {
        [matrix[row][col], matrix[row - 1][col]] = [
          matrix[row - 1][col],
          matrix[row][col],
        ];
      }
      break;
    case "down":
      if (row < matrix.length - 1) {
        [matrix[row][col], matrix[row + 1][col]] = [
          matrix[row + 1][col],
          matrix[row][col],
        ];
      }
      break;
    case "left":
      if (col > 0) {
        [matrix[row][col], matrix[row][col - 1]] = [
          matrix[row][col - 1],
          matrix[row][col],
        ];
      }
      break;
    case "right":
      if (col < matrix[row].length - 1) {
        [matrix[row][col], matrix[row][col + 1]] = [
          matrix[row][col + 1],
          matrix[row][col],
        ];
      }
      break;
  }
}

// Function to check if the matrix is sorted
function isSorted(matrix) {
  let comparisonArray = matrix.flat();
  for (let i = 0; i < comparisonArray.length - 1; i++) {
    if (comparisonArray[i] !== i + 1 && comparisonArray[i] !== 0) {
      return false;
    }
  }
  return true;
}

// Function to render the matrix on the page
function renderMatrix(matrix) {
  const matrixContainer = document.getElementById("matrix-container");
  matrixContainer.innerHTML = ""; // Clear the previous state

  matrix.forEach((row) => {
    const rowElement = document.createElement("div");
    row.forEach((cell) => {
      const cellElement = document.createElement("div");
      cellElement.textContent = cell !== 0 ? cell : ""; // Don't display 0
      cellElement.classList.add("cell");
      rowElement.appendChild(cellElement);
    });
    matrixContainer.appendChild(rowElement);
  });
}

// Function to handle player input
function handleKeyPress(event) {
  if (event.key === "Enter") {
    moveRandom(); // Move a random direction when Enter is pressed
    renderMatrix(matrix);
    if (isSorted(matrix)) {
      console.log("Congratulations! You solved the puzzle.");
      document.removeEventListener("keydown", handleKeyPress); // Remove the event listener once solved
    }
  }
}

// Event listener for the 'Enter' key press
document.addEventListener("keydown", handleKeyPress);

// Function to move in a random direction
function moveRandom() {
  const directions = ["up", "down", "left", "right"];
  const randomDirection =
    directions[Math.floor(Math.random() * directions.length)];
  move(matrix, randomDirection);
}

// Start the game
matrix = shuffleMatrix(matrix);
renderMatrix(matrix);
