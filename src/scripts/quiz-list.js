document.addEventListener('DOMContentLoaded', () => {
    const quizList = document.getElementById('quiz-list');
    const searchInput = document.getElementById('search-input'); // Get the search input

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

    // Fetching quizzes from the server
    fetch('/quizzes')
        .then(response => response.json())
        .then(quizzes => {
            // Store the quizzes in a variable for later filtering
            const allQuizzes = quizzes;

            // Function to render quizzes based on search
            function renderQuizzes(filteredQuizzes) {
                quizList.innerHTML = ''; // Clear current list
                filteredQuizzes.forEach(quiz => {
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
            }

            // Initial rendering of quizzes
            renderQuizzes(allQuizzes);

            // Event listener for the search input to filter quizzes dynamically
            searchInput.addEventListener('input', () => {
                const searchQuery = searchInput.value.toLowerCase(); // Get the search query in lowercase

                // Filter quizzes based on the title matching the search query
                const filteredQuizzes = allQuizzes.filter(quiz => quiz.title.toLowerCase().includes(searchQuery));

                // Render filtered quizzes
                renderQuizzes(filteredQuizzes);
            });
        })
        .catch(error => {
            console.error('Error fetching quiz list:', error);
        });
});

