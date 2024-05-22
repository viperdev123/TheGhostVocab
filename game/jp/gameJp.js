const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const wrongAnswerElement = document.getElementById('wrongans');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const popupElement = document.getElementById('popup');
const subquestion = document.getElementById('sub-question');
const zombieImage = document.querySelector('.zombie');
const chinImage = document.querySelector('.chin');

let score = 0;
let timerInterval;
let gameIsOver = false;
let vocabulary = [];

function fetchVocabularyFromDB() {
    fetch('http://localhost:3000/vocabularyJp')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            vocabulary = data.map(item => ({
                question: [item.question,item.subquestion],
                options: [item.options_1, item.options_2]
            }));
            loadQuestion();
        })
        .catch(error => {
            console.error('Error fetching vocabulary:', error);
        });
}

fetchVocabularyFromDB();

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadQuestion() {
    if (gameIsOver) return; // Exit if the game is over
    const randomIndex = Math.floor(Math.random() * vocabulary.length);
    const currentQuestion = vocabulary[randomIndex];
    questionElement.textContent = currentQuestion.question[0];                           // Display hiragana question
    subquestion.textContent = currentQuestion.question[1];                               // Display romanji question
    optionsElement.innerHTML = '';
    wrongAnswerElement.textContent = '';
    const shuffledOptions = [...currentQuestion.options];
    shuffle(shuffledOptions);

    shuffledOptions.forEach((option) => {
        const optionButton = document.createElement('div');
        optionButton.classList.add('option');
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => {
            if (gameIsOver) return; // Exit if the game is over
            clearInterval(timerInterval); // Stop the timer
            if (option === currentQuestion.options[0]) {
                score++; // Increment score for correct answerx
            } else {
                wrongAnswerElement.textContent = 'Wrong answer. ';
                showScore(); // Show total score
                popupElement.style.display = 'block'; // Show popup button
                timerElement.style.display = 'none';
                gameIsOver = true; // Set game over flag
                // Move the zombie image to the initial position
                zombieImage.style.left = `1000px`;
                setTimeout(() => {
                    chinImage.src = "";
                    zombieImage.src = "/asset/fight.gif";
                    chinImage.style.left = "1000px";
                    setTimeout(() => {
                        zombieImage.src = "";
                        chinImage.src = "/asset/chindie.png";

                    }, 2000);
                }, 400);

            }
            updateScoreDisplay(); // Update score display
            loadQuestion(); // Load a new random question
        });
        optionsElement.appendChild(optionButton);
    });
    startTimer();
}

function startTimer() {
    let timeLeft = 10;
    updateTimerDisplay(timeLeft);
    zombieImage.style.left = '200px'; // Set the initial position of the zombie image
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        moveZombieImage(); // Move the zombie image every time the timer ticks
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            timerElement.style.display = 'none';
            showScore(); // Show total score
            popupElement.style.display = 'block'; // Show popup button
            timerElement.style.display = 'none'; // Hide the timer element
            wrongAnswerElement.textContent = "Time's up";
            setTimeout(() => {
                chinImage.src = "";
                zombieImage.src = "/asset/fight.gif"
                chinImage.style.left = "1000px"
                setTimeout(() => {
                    zombieImage.src = ""
                    chinImage.src = "/asset/chindie.png";
                }, 2000);
            }, 300);
            gameIsOver = true; // Set game over flag
        }
    }, 1000);
}

function updateTimerDisplay(timeLeft) {
    if (gameIsOver) {
        timerElement.style.display = 'none'; // Hide timer when game is over
    } else {
        timerElement.style.display = 'block'; // Show timer when game is not over
        timerElement.textContent = `Time left: ${timeLeft} seconds`;
    }
}

function moveZombieImage() {
    const currentPosition = parseInt(zombieImage.style.left) || 0;
    const newPosition = currentPosition + 85;
    zombieImage.style.left = `${newPosition}px`;
}

function updateScoreDisplay() {
    scoreElement.textContent = `Score: ${score}`;
}

function showScore() {
    scoreElement.textContent = `Total Score: ${score}`;
}

function goToIndexPage() {
    window.location.href = 'index.html';
}

loadQuestion();

function reloadPage() {
    location.reload();
}
