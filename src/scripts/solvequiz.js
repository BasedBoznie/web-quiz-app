// src/scripts/solvequiz.js

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
let quizId;

// Function to load the quiz data
function loadQuiz(quizName) {
    fetch(`/quizzes/${quizName}.json`)
        .then(response => response.json())
        .then(data => {
            quizData = data.questions;
            quizId = data.timestamp;
            const quizIdElement = document.getElementById('quiz-id');
            if (quizIdElement) {
                quizIdElement.textContent = quizId;
            }
            document.title = data.title; // Set page title to quiz title
            const quizTitleElement = document.getElementById('quiz-title');
            if (quizTitleElement) {
                quizTitleElement.textContent = data.title; // Display quiz title on the page
            }
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

    // Get question and options containers
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');

    // Clear previous content
    questionContainer.innerHTML = '';
    optionsContainer.innerHTML = ''; // Clear previous options only

    const questionData = quizData[currentQuestionIndex];
    const questionText = document.createElement('h3');
    questionText.textContent = `Q${currentQuestionIndex + 1}: ${questionData.question}`;
    questionContainer.appendChild(questionText);

    // Add the options to optionsContainer
    const optionCount = questionData.options.length;
    optionsContainer.className = ''; // Reset any previous classes
    optionsContainer.classList.add(
        optionCount === 2 ? 'two-options' :
        optionCount === 3 ? 'three-options' :
        optionCount === 4 ? 'four-options' :
        optionCount === 5 ? 'five-options' :
        optionCount === 6 ? 'six-options' :
        optionCount === 7 ? 'seven-options' :
        'eight-options'
    );

    questionData.options.forEach(option => {
        const optionLabel = document.createElement('label');
        optionLabel.className = 'option-label';

        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = 'option';
        optionInput.value = option;

        optionInput.addEventListener('change', () => {
            document.querySelectorAll('.option-label').forEach(label => label.classList.remove('selected'));
            optionLabel.classList.add('selected');
        });

        optionLabel.appendChild(optionInput);
        optionLabel.appendChild(document.createTextNode(option));
        optionsContainer.appendChild(optionLabel);
    });

    // Add Next/Submit button
    const nextButton = document.createElement('button');
    nextButton.classList.add("next-btn");
    nextButton.textContent = currentQuestionIndex < quizData.length - 1 ? 'Next' : 'Submit';
    nextButton.addEventListener('click', checkAnswer);
    questionContainer.appendChild(nextButton);

    // Append optionsContainer to questionContainer if not already there
    questionContainer.appendChild(optionsContainer);
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
