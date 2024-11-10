document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quiz-form');
    quizForm.addEventListener('submit', submitQuiz);
});

let questionCount = 0;

// Function to generate a timestamp
function generateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function addQuestion() {
    if (questionCount >= 30) {
        alert("Maximum of 30 questions reached.");
        return;
    }

    questionCount++;
    const questionsContainer = document.getElementById('questions-container');
    const questionDiv = document.createElement('div');
    questionDiv.className = `question question-options-${questionCount}`;
    questionDiv.id = `question-${questionCount}`;

    questionDiv.innerHTML = `
        <h3>Question ${questionCount}</h3>
        <input type="text" name="question-${questionCount}" placeholder="Enter question" required>
        <div class="options-container" id="options-container-${questionCount}">
            <!-- Options will be added here -->
        </div>
        <button type="button" onclick="addOption(${questionCount})">Add Option</button>
        <button type="button" onclick="removeQuestion(${questionCount})">Remove Question</button>
    `;
    
    questionsContainer.appendChild(questionDiv);
    addOption(questionCount); // Add the first two options by default
    addOption(questionCount);
}

function removeQuestion(questionId) {
    const questionDiv = document.getElementById(`question-${questionId}`);
    if (questionDiv) {
        questionDiv.remove();
        questionCount--;
    }
}

function addOption(questionId) {
    const optionsContainer = document.getElementById(`options-container-${questionId}`);
    const optionCount = optionsContainer.children.length;

    if (optionCount >= 8) {
        alert("Maximum of 8 options per question reached.");
        return;
    }

    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';
    optionDiv.innerHTML = `
        <input type="radio" name="correct-answer-${questionId}" value="${optionCount}" required>
        <input type="text" name="question-${questionId}-option-${optionCount}" placeholder="Enter option" required>
        <button type="button" onclick="removeOption(${questionId}, ${optionCount})">Remove Option</button>
    `;

    optionsContainer.appendChild(optionDiv);
}

function removeOption(questionId, optionIndex) {
    const optionsContainer = document.getElementById(`options-container-${questionId}`);
    const optionCount = optionsContainer.children.length;

    if (optionCount <= 2) {
        alert("Each question must have at least 2 options.");
        return;
    }

    const optionDiv = optionsContainer.children[optionIndex];
    if (optionDiv) {
        optionDiv.remove();
    }
}

function submitQuiz(event) {
    event.preventDefault();

    const quizTitle = document.getElementById('title').value;
    const questions = [];

    for (let i = 1; i <= questionCount; i++) {
        const questionText = document.querySelector(`#question-${i} input[type="text"]`).value;
        const optionsContainer = document.getElementById(`options-container-${i}`);
        const options = Array.from(optionsContainer.querySelectorAll('input[type="text"]')).map(optionInput => optionInput.value);
        const correctAnswerIndex = Array.from(optionsContainer.querySelectorAll('input[type="radio"]')).findIndex(radio => radio.checked);

        if (options.length < 2 || options.length > 8 || correctAnswerIndex === -1) {
            alert(`Question ${i} is invalid. Make sure it has 2-8 options and one correct answer selected.`);
            return;
        }

        questions.push({
            question: questionText,
            options: options,
            answer: options[correctAnswerIndex]
        });
    }

    // Validate that there is at least one question
    if (questions.length === 0) {
        alert("You must add at least one question before saving the quiz.");
        return;
    }

    // Generate the timestamp
    const timestamp = generateTimestamp();

    // Quiz data to be sent to the server
    const quizData = {
        title: quizTitle,
        timestamp: timestamp,
        questions: questions
    };

    fetch('/save-quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizData)
    })
    .then(response => {
        if (response.ok) {
            alert("Quiz saved successfully!");
            window.location.href = 'index.html'; // Redirect to main page after save
        } else {
            alert("Failed to save quiz.");
        }
    })
    .catch(error => console.error('Error saving quiz:', error));
}
