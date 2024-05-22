const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); 
const path = require('path'); 
const app = express();
const port = 3000;
const db = new sqlite3.Database('database/Vocab.db');
app.use(cors());
app.use(express.json());
const publicDirectoryPath = path.join(__dirname, 'public');
app.use(express.static(publicDirectoryPath));

// GET endpoint to retrieve vocabulary for English
app.get('/vocabularyEng', (req, res) => {
    db.all('SELECT * FROM vocabularyEng', (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows);
        }
    });
});

// GET endpoint to retrieve vocabulary for Japanese
app.get('/vocabularyJp', (req, res) => {
    db.all('SELECT * FROM vocabularyJp', (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows);
        }
    });
});

// GET endpoint to retrieve vocabulary for Chinese
app.get('/vocabularyCn', (req, res) => {
    db.all('SELECT * FROM vocabularyCn', (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows);
        }
    });
});
app.post('/addVocabularyCn', (req, res) => {
    db.run('INSERT INTO vocabularyCn (question, subquestion, options_1, options_2) VALUES (?, ?, ?, ?)',
        [req.body.vocabulary, req.body.subVocabulary, req.body.option1, req.body.option2],
        function(err) {
            if (err) {
                console.error('Error inserting vocabulary:', err);
                res.status(500).json({ error: 'Failed to add vocabulary.' });
            } else {
                console.log('Vocabulary added successfully.');
                res.status(200).send('Vocabulary added successfully.');
            }
        }
    );
});
app.post('/addVocabularyJp', (req, res) => {
    db.run('INSERT INTO vocabularyJp (question, subquestion, options_1, options_2) VALUES (?, ?, ?, ?)',
        [req.body.vocabulary, req.body.subVocabulary, req.body.option1, req.body.option2],
        function(err) {
            if (err) {
                console.error('Error inserting vocabulary:', err);
                res.status(500).json({ error: 'Failed to add vocabulary.' });
            } else {
                console.log('Vocabulary added successfully.');
                res.status(200).send('Vocabulary added successfully.');
            }
        }
    );
});

app.post('/addVocabularyEng', (req, res) => {
    db.run('INSERT INTO vocabularyEng (question, options_1, options_2) VALUES (?, ?, ?)',
        [req.body.vocabulary, req.body.option1, req.body.option2],
        function(err) {
            if (err) {
                console.error('Error inserting vocabulary:', err);
                res.status(500).json({ error: 'Failed to add vocabulary.' });
            } else {
                console.log('Vocabulary added successfully.');
                res.status(200).send('Vocabulary added successfully.');
            }
        }
    );
});


// DELETE endpoint to delete vocabulary entries from the English table based on question
app.delete('/vocabularyEng', (req, res) => {
    const question = req.body.question;
    db.run(`DELETE FROM vocabularyEng WHERE question = ?`, question, (err) => {
        if (err) {
            console.error('Error deleting vocabulary:', err);
            res.status(500).json({ error: 'Failed to delete vocabulary.' });
        } else {
            console.log('Vocabulary deleted successfully.');
            res.status(200).send('Vocabulary deleted successfully.');
        }
        console.log(question)
    });
});

// DELETE endpoint to delete vocabulary entries from the Japanese table based on question
app.delete('/vocabularyJp', (req, res) => {
    const question = req.body.question;
    db.run(`DELETE FROM vocabularyJp WHERE question = ?`, question, (err) => {
        if (err) {
            console.error('Error deleting vocabulary:', err);
            res.status(500).json({ error: 'Failed to delete vocabulary.' });
        } else {
            console.log('Vocabulary deleted successfully.');
            res.status(200).send('Vocabulary deleted successfully.');
        }
        console.log(question)
    });
});

// DELETE endpoint to delete vocabulary entries from the Chinese table based on question
app.delete('/vocabularyCn', (req, res) => {
    const question = req.body.question;
    db.run(`DELETE FROM vocabularyCn WHERE question = ?`, question, (err) => {
        if (err) {
            console.error('Error deleting vocabulary:', err);
            res.status(500).json({ error: 'Failed to delete vocabulary.' });
        } else {
            console.log('Vocabulary deleted successfully.');
            res.status(200).send('Vocabulary deleted successfully.');   
        }
        console.log(question)
    });
});

// PUT endpoint to update vocabulary entries in the English table based on question
app.put('/updateVocabularyEng', (req, res) => {
    const { question, newQuestion, newOption1, newOption2 } = req.body;
    db.run(
        `UPDATE vocabularyEng SET question = ?, options_1 = ?, options_2 = ? WHERE question = ?`,
        [newQuestion, newOption1, newOption2, question],
        (err) => {
            if (err) {
                console.error('Error updating vocabulary:', err);
                res.status(500).json({ error: 'Failed to update vocabulary.' });
            } else {
                console.log('Vocabulary updated successfully.');
                res.status(200).send('Vocabulary updated successfully.');
            }
            console.log(question);
        }
    );
});

// PUT endpoint to update vocabulary entries in the Japanese table based on question
app.put('/updateVocabularyJp', (req, res) => {
    const { question, newQuestion, newSubQuestion, newOption1, newOption2 } = req.body;
    db.run(
        `UPDATE vocabularyJp SET question = ?, subquestion = ?, options_1 = ?, options_2 = ? WHERE question = ?`,
        [newQuestion, newSubQuestion, newOption1, newOption2, question],
        (err) => {
            if (err) {
                console.error('Error updating vocabulary:', err);
                res.status(500).json({ error: 'Failed to update vocabulary.' });
            } else {
                console.log('Vocabulary updated successfully.');
                res.status(200).send('Vocabulary updated successfully.');
            }
            console.log(question);
        }
    );
});

// PUT endpoint to update vocabulary entries in the Chinese table based on question
app.put('/updateVocabularyCn', (req, res) => {
    const { question, newQuestion, newSubQuestion, newOption1, newOption2 } = req.body;
    db.run(
        `UPDATE vocabularyCn SET question = ?, subquestion = ?, options_1 = ?, options_2 = ? WHERE question = ?`,
        [newQuestion, newSubQuestion, newOption1, newOption2, question],
        (err) => {
            if (err) {
                console.error('Error updating vocabulary:', err);
                res.status(500).json({ error: 'Failed to update vocabulary.' });
            } else {
                console.log('Vocabulary updated successfully.');
                res.status(200).send('Vocabulary updated successfully.');
            }
            console.log(question);
        }
    );
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


