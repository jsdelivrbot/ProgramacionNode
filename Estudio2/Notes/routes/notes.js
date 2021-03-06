'use strict';

var util = require('util');
var express = require('express');
var router = express.Router();
//var notes = require('../models/notes-memory');

var path = require('path');
var notes =require(process.env.NOTES_MODEL
  ? path.join('..', process.env.NOTES_MODEL)
  : '../models/notes-memory');

const log = require('debug')('notes:router-home');
const error = require('debug')('notes:error');

// Add Note.
router.get('/add', (req, res, next) => {
    res.render('noteedit', {
        title: "Add a Note",
        docreate: true,
        notekey: "",
        note: undefined
    });
});
module.exports = router;

// Save Note
router.post('/save', (req, res, next) => {
    var p;
    if (req.body.docreate === "create") {
        p = notes.create(req.body.notekey,
        req.body.title, req.body.body);
    } else {
        p = notes.update(req.body.notekey,
        req.body.title, req.body.body);
    }
    p.then(note => {
        res.redirect('/notes/view?key='+ req.body.notekey);
    })
    .catch(err => { next(err); });
});

router.get('/view', (req, res, next) => {
    notes.read(req.query.key)
    .then(note => {
        res.render('noteview', {
            title: note ? note.title : "",
            notekey: req.query.key,
            note: note
        });
    })
    .catch(err => { next(err); });
    });

//Edit a Note
router.get('/edit', (req, res, next) => {
    notes.read(req.query.key)
    .then(note => {
        res.render('noteedit', {
            title: note ? ("Edit " + note.title) : "Add a Note",
            docreate: false,
            notekey: req.query.key,
            note: note
        });
    })
    .catch(err => { next(err); });
});

//Delete a Note
router.get('/destroy', (req, res, next) => {
    notes.read(req.query.key)
    .then(note => {
        res.render('notedestroy', {
            title: note ? note.title : "",
            notekey: req.query.key,
            note: note
        });
    })
    .catch(err => { next(err); });
});

//Confirms deletion
router.post('/destroy/confirm', (req, res, next) => {
    notes.destroy(req.body.notekey)
    //notes.destroy(req.query.key)
    .then(() => { res.redirect('/'); })
    .catch(err => { next(err); });
});