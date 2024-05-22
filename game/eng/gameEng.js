const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const wrongAnswerElement = document.getElementById('wrongans');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const popupElement = document.getElementById('popup');
const zombieImage = document.querySelector('.zombie');
const chinImage = document.querySelector('.chin');

let score = 0;
let timerInterval;
let gameIsOver = false;
let vocabulary = [];

function fetchVocabularyFromDB() {
    fetch('http://localhost:3000/vocabularyEng')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            vocabulary = data.map(item => ({
                question: item.question,
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
    if (gameIsOver) return;
    const randomIndex = Math.floor(Math.random() * vocabulary.length);
    const currentQuestion = vocabulary[randomIndex];
    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = '';
    wrongAnswerElement.textContent = '';
    const shuffledOptions = [...currentQuestion.options];
    shuffle(shuffledOptions);

    shuffledOptions.forEach((option) => {
        const optionButton = document.createElement('div');
        optionButton.classList.add('option');
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => {
            if (gameIsOver) return;
            clearInterval(timerInterval);
            if (option === currentQuestion.options[0]) {
                score++;
                moveZombieImage();
            } else {
                wrongAnswerElement.textContent = 'Wrong answer. ';
                showScore();
                popupElement.style.display = 'block';
                gameIsOver = true;
                zombieImage.style.left = `1000px`;
                setTimeout(() => {
                    chinImage.src = "";
                    chinImage.style.left = "1000px"
                    zombieImage.src = "/asset/fight.gif";
                    setTimeout(() => {
                        zombieImage.src = "";
                        chinImage.src = "/asset/chindie.png";
                    }, 2000);
                }, 400);
            }
            updateScoreDisplay();
            loadQuestion();
        });
        optionsElement.appendChild(optionButton);
    });

    startTimer();
}

function startTimer() {
    let timeLeft = 10;
    updateTimerDisplay(timeLeft);
    zombieImage.style.left = '200px';
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        moveZombieImage();
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            showScore();
            popupElement.style.display = 'block';
            timerElement.style.display = 'none';
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
            gameIsOver = true;
        }
    }, 1000);
}

function updateTimerDisplay(timeLeft) {
    if (gameIsOver) {
        timerElement.style.display = 'none';
    } else {
        timerElement.style.display = 'block';
        timerElement.textContent = `Time left: ${timeLeft} seconds`;
    }
}

function moveZombieImage() {
    const currentPosition = parseInt(zombieImage.style.left) || 0;
    const newPosition = currentPosition + 80;
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

function reloadPage() {
    location.reload();
}


