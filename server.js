// server.js
const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser.json());

// API route to get quiz data
app.get('/quizzes/:quiz', (req, res) => {
    const quizName = req.params.quiz;
    const quizPath = path.join(__dirname, 'quizzes', `${quizName}`);
    console.log('Quiz path:', quizPath);  // Debugging: Log the quiz file path
    res.sendFile(quizPath, (err) => {
        if (err) {
            console.error('Error:', err);  // Log the error
            res.status(404).send("Quiz not found");
        }
    });
});


// Default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Endpoint to get the list of quizzes with titles
app.get('/quizzes', (req, res) => {
    const quizzesDir = path.join(__dirname, 'quizzes');
    
    fs.readdir(quizzesDir, (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Unable to list quizzes' });
        } else {
            const quizzesWithTitles = files
                .filter(file => file.endsWith('.json')) // Only JSON files
                .map(file => {
                    const quizPath = path.join(quizzesDir, file);
                    const quizData = JSON.parse(fs.readFileSync(quizPath, 'utf8'));
                    return { filename: file, title: quizData.title, timestamp: quizData.timestamp }; // Include filename and title
                });
                
            res.json(quizzesWithTitles); // Send the array of quizzes with titles to the client
        }
    });
});

// Endpoint to handle quiz save requests
app.post('/save-quiz', (req, res) => {
    const quizData = req.body;
    if (!quizData.title || !quizData.questions) {
        return res.status(400).json({ error: "Invalid quiz data" });
    }

    const timestamp = quizData.timestamp;
    const filename = `${quizData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${timestamp}.json`;
    const filePath = path.join(__dirname, 'quizzes', filename);

    fs.writeFile(filePath, JSON.stringify(quizData, null, 2), (err) => {
        if (err) {
            console.error("Error saving quiz:", err);
            res.status(500).json({ error: "Failed to save quiz" });
        } else {
            res.status(200).json({ message: "Quiz saved successfully" });
        }
    });
});


const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
