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

// Function to move the empty space
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
  let correctOrder = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0],
  ];
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] !== correctOrder[row][col]) {
        return false;
      }
    }
  }
  return true;
}

// Function to render the matrix on the page
function renderMatrix(matrix) {
  const matrixContainer = document.getElementById("matrix-container");
  matrixContainer.innerHTML = ""; // Clear the previous state

  matrix.forEach((row) => {
    row.forEach((cell) => {
      const cellElement = document.createElement("div");
      cellElement.textContent = cell !== 0 ? cell : ""; // Don't display 0
      cellElement.classList.add("cell");
      matrixContainer.appendChild(cellElement);
    });
  });
}

// Function to log the matrix to the console
function logMatrix(matrix) {
  console.log(matrix.map((row) => row.join(" ")).join("\n"));
}

// BFS algorithm to find the solution path
function bfsSolve(matrix) {
  let queue = [];
  let visited = new Set();
  queue.push({ matrix: matrix, path: [] });
  visited.add(matrix.flat().toString());

  while (queue.length > 0) {
    let currentNode = queue.shift();
    let currentMatrix = currentNode.matrix;
    let currentPath = currentNode.path;

    if (isSorted(currentMatrix)) {
      return currentPath;
    }

    let directions = ["up", "down", "left", "right"];
    for (let direction of directions) {
      let newMatrix = JSON.parse(JSON.stringify(currentMatrix));
      move(newMatrix, direction);

      if (!visited.has(newMatrix.flat().toString())) {
        queue.push({ matrix: newMatrix, path: [...currentPath, direction] });
        visited.add(newMatrix.flat().toString());
      }
    }
  }

  return [];
}

// Function to handle solving the puzzle step by step
function solveStepByStep(solutionPath) {
  if (solutionPath.length > 0) {
    let nextMove = solutionPath.shift(); // Get the next move
    move(matrix, nextMove);
    renderMatrix(matrix);
    // logMatrix(matrix); // Log the matrix at each step
    setTimeout(() => solveStepByStep(solutionPath), 200); // Call the function again after 500ms
  } else {
    if (isSorted(matrix)) {
      const customAlert = document.getElementById("custom-alert");
      customAlert.classList.remove("hidden");
      setTimeout(() => {
        customAlert.classList.add("hidden");
      }, 3000);
      console.log("Congratulations! You solved the puzzle.");
    }
  }
}

// Function to handle button click
function handleButtonClick() {
  let solutionPath = bfsSolve(matrix);
  if (solutionPath.length > 0) {
    solveStepByStep(solutionPath);
  } else {
    console.log("No solution found.");
  }
}

// Add event listener for the 'Solve' button
document
  .getElementById("solve-button")
  .addEventListener("click", handleButtonClick);

// Start the game
matrix = shuffleMatrix(matrix);
renderMatrix(matrix);
logMatrix(matrix); // Log the initial state
