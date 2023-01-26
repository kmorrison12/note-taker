const express = require('express')
const fs = require('fs')
const path = require('path')
const noteData = require('./Develop/db/db.json')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = 3001

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(express.json())

// GET to return the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/develop/public/index.html'))
})

// GET to return the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/develop/public/notes.html'))
})

// GET /api/notes should read the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => res.json(noteData));


// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client
app.post('/api/notes', (req, res) => {
    res.json(`${req.method} request received`)

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuidv4(),
        };

        fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err)
            } else {
                const parsedNotes = JSON.parse(data)
                parsedNotes.push(newNote)

                fs.writeFile(
                    './Develop/db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) => writeErr ? console.error(writeErr) : console.info('successfully updated notes')
                )
            }
        })

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});


app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
})
