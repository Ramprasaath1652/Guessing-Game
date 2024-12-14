let timer = 0;
let interval;
let computerNumber = "";
let attempts = 0;
let playerName = "";

// Start new game
document.getElementById("newGameButton").addEventListener("click", () => {
    playerName = prompt("Enter your name:");
    if (!playerName) {
        alert("Name is required to start the game!");
        return;
    }

    // Reset the game
    timer = 0;
    attempts = 0;
    computerNumber = generateUniqueNumber();
    document.getElementById("gameOutput").innerHTML = "";
    document.getElementById("usernameInput").value = playerName;
    document.getElementById("gameInput").classList.remove("hidden");

    // Start timer
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
        timer++;
        document.getElementById("timer").innerText = `Timer: ${timer} seconds`;
    }, 1000);
});

// Submit guess
document.getElementById("submitGuessButton").addEventListener("click", () => {
    const guess = document.getElementById("guessInput").value;
    if (!isValidGuess(guess)) {
        alert("Please enter a valid 4-digit number with unique digits.");
        return;
    }

    attempts++;
    const feedback = checkGuess(guess);
    document.getElementById("gameOutput").innerHTML = `Feedback: ${feedback}`;

    if (feedback === "++++") {
        clearInterval(interval);
        document.getElementById("gameOutput").innerHTML = `Congratulations ${playerName}! You guessed the number in ${attempts} attempts and ${timer} seconds.`;

        // Save score to leaderboard
        saveScore(playerName, attempts, timer);
    }
});

// Generate a unique 4-digit number
function generateUniqueNumber() {
    const digits = [];
    while (digits.length < 4) {
        const rand = Math.floor(Math.random() * 10).toString();
        if (!digits.includes(rand)) {
            digits.push(rand);
        }
    }
    const uniqueNumber = digits.join("");
    console.log("Computer's chosen number:", uniqueNumber); // Logs the number to the console
    return uniqueNumber;
}


// Validate the guess
function isValidGuess(guess) {
    if (guess.length !== 4) return false;
    const uniqueDigits = new Set(guess.split(""));
    return uniqueDigits.size === 4 && !isNaN(guess);
}

// Check the guess against the computer's number
function checkGuess(guess) {
    let plus = 0;
    let minus = 0;

    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === computerNumber[i]) {
            plus++;
        } else if (computerNumber.includes(guess[i])) {
            minus++;
        }
    }
    return "+".repeat(plus) + "-".repeat(minus);
}

// Save score to the server
function saveScore(name, moves, time) {
    fetch("save_score.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, moves, time }),
    })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("leaderboard").innerText = `Best Player: ${data.bestPlayer}`;
        })
        .catch((err) => console.error("Error saving score:", err));
}
