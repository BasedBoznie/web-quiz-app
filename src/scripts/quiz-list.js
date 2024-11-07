document.addEventListener('DOMContentLoaded', () => {
    const quizList = document.getElementById('quiz-list');

    fetch('/quizzes') // Fetching quizzes from the server
        .then(response => response.json())
        .then(quizzes => {
            quizzes.forEach(quiz => {
                if (quiz && quiz.filename && quiz.title) { // Ensure quiz data is valid
                    const listItem = document.createElement('li');
                    const quizLink = document.createElement('a');
                    
                    quizLink.href = `/solve-quiz.html?quiz=${quiz.filename.replace('.json', '')}`;
                    quizLink.textContent = quiz.title; // Display the quiz title
                    
                    listItem.appendChild(quizLink);
                    quizList.appendChild(listItem);
                } else {
                    console.error('Invalid quiz data:', quiz);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching quiz list:', error);
        });
});

