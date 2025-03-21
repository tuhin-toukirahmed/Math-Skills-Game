let timer;
let timeLeft = 180; // 3 minutes
let score = 0;
let correctAnswer;
let playerName = "";
let level = "easy";
let streakCount = 0; // Track consecutive correct answers

function startGame() {
  playerName = document.getElementById("playerName").value.trim();
  level = document.getElementById("difficulty").value;

  if (!playerName) {
    alert("Please enter your name!");
    return;
  }

  document.getElementById("landingPage").classList.add("hidden");
  document.getElementById("gamePage").classList.remove("hidden");

  score = 0;
  streakCount = 0; // Reset streak at game start
  timeLeft = 180; // Changed back to 3 minutes (180 seconds)
  document.getElementById("score").innerText = score;
  startTimer();
  generateQuestion();
}

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    } else {
      timeLeft--;
      let minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;
      document.getElementById("timer").innerText = `${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    }
  }, 1000);
}

function generateQuestion() {
  let num1, num2, operator;

  if (level === "easy") {
    num1 = Math.floor(Math.random() * 90) + 10;
    num2 = Math.floor(Math.random() * 90) + 10;
    operator = Math.random() > 0.5 ? "+" : "-";
  } else if (level === "medium") {
    let ops = ["+", "-", "*", "/"];
    operator = ops[Math.floor(Math.random() * 4)];

    if (operator === "+" || operator === "-") {
      // 3-digit numbers for addition and subtraction
      num1 = Math.floor(Math.random() * 900) + 100;
      num2 = Math.floor(Math.random() * 900) + 100;
    } else if (operator === "*") {
      // 2-digit number * single-digit number for multiplication
      num1 = Math.floor(Math.random() * 90) + 10;
      num2 = Math.floor(Math.random() * 9) + 1;
    } else if (operator === "/") {
      // 2-digit number ÷ single-digit number for division
      num2 = Math.floor(Math.random() * 9) + 1;
      // Make num1 divisible by num2
      let factor = Math.floor(Math.random() * 9) + 1;
      num1 = num2 * factor;
    }
  } else {
    let ops = ["+", "-", "*", "/"];
    operator = ops[Math.floor(Math.random() * 4)];
    num1 = Math.floor(Math.random() * 90) + 10;
    num2 = Math.floor(Math.random() * 90) + 10;
    if (operator === "/") num1 = num2 * Math.floor(Math.random() * 9 + 1);
  }

  correctAnswer = eval(`${num1} ${operator} ${num2}`);
  correctAnswer = Number.isInteger(correctAnswer)
    ? correctAnswer
    : correctAnswer.toFixed(2);
  document.getElementById("question").innerText = `${num1} ${operator} ${num2}`;
}

function checkAnswer() {
  let userAnswer = parseFloat(document.getElementById("answer").value);
  let feedbackElement = document.getElementById("feedbackMessage");

  if (!isNaN(userAnswer)) {
    if (userAnswer == correctAnswer) {
      score += 3;
      streakCount++; // Increment streak on correct answer

      // Dynamic feedback based on streak
      if (streakCount >= 5) {
        feedbackElement.textContent =
          "AMAZING! 5+ correct answers in a row! 🔥🔥🔥";
      } else if (streakCount >= 3) {
        feedbackElement.textContent =
          "WOW! 3+ correct answers in a row! You're on fire! 🔥";
      } else {
        feedbackElement.textContent = "Congratulations! That's correct! 🎉";
      }

      feedbackElement.className =
        "mt-2 font-medium text-base sm:text-lg text-green-400";
    } else {
      score -= 1;
      streakCount = 0; // Reset streak on wrong answer

      // Encouraging messages for wrong answers
      const encouragements = [
        `Take your time . The correct answer is ${correctAnswer}.`,
        `Stay focused! The correct answer is ${correctAnswer}.`,
        `Almost there! . The correct answer is ${correctAnswer}.`,
        `Keep trying! The correct answer is ${correctAnswer}.`,
      ];

      // Select a random encouragement
      const randomMessage =
        encouragements[Math.floor(Math.random() * encouragements.length)];
      feedbackElement.textContent = randomMessage;
      feedbackElement.className =
        "mt-2 font-medium text-base sm:text-lg text-red-400";
    }

    feedbackElement.classList.remove("hidden");
    document.getElementById("score").innerText = score;
  }

  // Clear the input field
  document.getElementById("answer").value = "";

  // Wait 1.5 seconds before generating a new question
  setTimeout(() => {
    feedbackElement.classList.add("hidden");
    generateQuestion();
  }, 1500);
}

function endGame() {
  document.getElementById("gamePage").classList.add("hidden");
  document.getElementById("resultPage").classList.remove("hidden");
  document.getElementById("finalScore").innerText = score;

  // Capitalize first letter of player name
  const capitalizedName =
    playerName.charAt(0).toUpperCase() + playerName.slice(1);

  document.getElementById(
    "finalMessage"
  ).innerText = `Congratulations, ${capitalizedName}!`;
}

function goBack() {
  clearInterval(timer);

  // Show the result page with the current score
  document.getElementById("gamePage").classList.add("hidden");
  document.getElementById("resultPage").classList.remove("hidden");

  // Update score and add a message about game being stopped early
  document.getElementById("finalScore").innerText = score;

  // Capitalize first letter of player name
  const capitalizedName =
    playerName.charAt(0).toUpperCase() + playerName.slice(1);

  // Custom message showing the game was stopped early
  document.getElementById("finalMessage").innerHTML = `Game stopped early.`;

  // No need to clear inputs yet since we're showing results first
}

// Then modify restartGame to handle clearing inputs
function restartGame() {
  document.getElementById("resultPage").classList.add("hidden");
  document.getElementById("landingPage").classList.remove("hidden");
  clearInputs();
}

function clearInputs() {
  document.getElementById("playerName").value = "";
  document.getElementById("answer").value = "";
  document.getElementById("difficulty").value = "easy";
}
