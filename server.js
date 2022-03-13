const express = require("express");
let notes = require("./db/db.json");
const path = require("path");
const fs = require("fs");
const app = express();
const uniqid = require('uniqid');

const PORT = process.env.PORT || 3001;

// middleware
app.use(express.static("public"));
// understand post requests json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

// notes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

// api routes
app.get("/api/notes", (req, res) => {
    // res.json(db)
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

// create new notes with unique id
app.post("/api/notes", (req, res) => {
    let newNote = req.body
    let newID = uniqid();
    newNote.id = newID;

    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err
        let dbfile = JSON.parse(data)
        dbfile.push(newNote)
        fs.writeFile("./db/db.json", JSON.stringify(dbfile), "UTF-8", err => {
            if (err) throw err
        })
    })
    // db.push(req.body)
    // fs.writeFile("./db/db.json", JSON.stringify(db), () => {
    //     res.json(req.body)
    // });
    res.redirect("/notes")
});

app.delete('/api/notes/:id', (req, res) => {
    let readfileSync = fs.readFileSync(path.join(__dirname, '/db/db.json'));
    let dbfile = JSON.parse(readfileSync)
    let currentID = req.params.id
    let dbfileFiltered = dbfile.filter(note => note.id != currentID)
    fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(dbfileFiltered))
    res.sendStatus(200)
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(3001, () => {
    console.log("server is running")
});