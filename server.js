const express = require("express");
let db = require("./db/db.json");
const path = require("path");
const fs = require("fs");
const app = express();
const { v4: uuidv4 } = require('uuid');
app.use(express.static("public"));
// understand post requests json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

app.get("/api/notes", (req, res) => {
    res.json(db)
})

app.post("/api/notes", (req, res) => {
    console.log(req.body)
    db.push(req.body)
    fs.writeFile("./db/db.json", JSON.stringify(db), () => {
        res.json(req.body)
    })
})

 app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

app.listen(3000, () => {
    console.log("server is running")
})