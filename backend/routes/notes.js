const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


// Route 1:Get all the notesusing: POST "/api/notes/fetchallnotes" .  loggin  require
router.get('/fetchallnotes', fetchuser, async (req, res) =>
{
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

// Route 2:Add the new note using: POST "/api/addnote" .  loggin  require
router.post('/addnote', fetchuser, [
    body('title', 'Enter a vaild Title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 Characters').isLength({ min: 5 }),
], async (req, res) =>
{
    try {


        const { title, description, tag } = req.body
        // If there are errors , return Bad request and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save()
        res.json(saveNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

// Route 3:Update an existing note using: put "/api/updatenote" .  loggin  require
router.put('/updatenote/:id', fetchuser, async (req, res) =>
{
    const { title, description, tag } = req.body;
    try {
        // Create new note object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

// Route 4:Delete an existing note using: BELETE "/api/deletenote" .  loggin  require
router.delete('/deletenote/:id', fetchuser, async (req, res) =>
{
    try {
        // find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }

        // Allow deletion only if user owns this note 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})
module.exports = router;