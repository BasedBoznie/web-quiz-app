// src/scripts/solveQuiz.js

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizName = urlParams.get('quiz');
    if (quizName) {
        loadQuiz(quizName); // Load the selected quiz
    }
});

let currentQuestionIndex = 0;
let score = 0;
let quizData = [];

// Function to load the quiz data
function loadQuiz(quizName) {
    fetch(`/quizzes/${quizName}.json`)
        .then(response => response.json())
        .then(data => {
            quizData = data.questions;
            displayQuestion();
        })
        .catch(error => console.error('Error loading quiz:', error));
}

// Function to display the current question and options
function displayQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        displayResult();
        return;
    }

    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = ''; // Clear previous content

    const questionData = quizData[currentQuestionIndex];
    const questionText = document.createElement('h3');
    questionText.textContent = `Q${currentQuestionIndex + 1}: ${questionData.question}`;
    questionContainer.appendChild(questionText);

    questionData.options.forEach(option => {
        const optionLabel = document.createElement('label');
        optionLabel.className = 'option-label';
        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = 'option';
        optionInput.value = option;
        optionLabel.appendChild(optionInput);
        optionLabel.appendChild(document.createTextNode(option));
        questionContainer.appendChild(optionLabel);
    });

    const nextButton = document.createElement('button');
    nextButton.textContent = currentQuestionIndex < quizData.length - 1 ? 'Next' : 'Submit';
    nextButton.addEventListener('click', checkAnswer);
    questionContainer.appendChild(nextButton);
}

// Function to check the selected answer
function checkAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (!selectedOption) {
        alert('Please select an answer!');
        return;
    }

    const selectedAnswer = selectedOption.value;
    const correctAnswer = quizData[currentQuestionIndex].answer;
    if (selectedAnswer === correctAnswer) {
        score++;
    }

    currentQuestionIndex++;
    displayQuestion();
}

// Function to display the final result
function displayResult() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `<h2>Your Score: ${score} / ${quizData.length}</h2>`;
}
