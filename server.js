const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend, writeToFile } = require('./utility/utils');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for the project
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// HTML routes

// Route for the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// API routes

// GET route to return the db.json notes
app.get('/api/notes', async (req, res) => {
    try {
        const rawNotes = await readFromFile('./db/db.json');
        const data = JSON.parse(rawNotes);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve notes' });
    }
});

// POST route to add new notes to the list
app.post('/api/notes', async (req, res) => {
    try {
        const { title, text } = req.body;
        const newNote = {
            id: uuidv4(),
            title,
            text,
        };
        await readAndAppend(newNote, './db/db.json');
        res.json({ message: 'Note added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add the note' });
    }
});

// DELETE route to delete notes based on the generated id
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const noteToDelete = req.params.id;
        const rawFile = await readFromFile('./db/db.json');
        const data = JSON.parse(rawFile);
        const updatedNotes = data.filter((note) => note.id !== noteToDelete);
        await writeToFile('./db/db.json', updatedNotes);
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete the note' });
    }
});

// Route for the index.html file (Fallback route)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Start the server
app.listen(PORT, (err) => {
    if (err) console.error(err);
    console.log(`App listening on Port: ${PORT}`);
});
