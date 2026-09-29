// commonJSモジュールによるimport
const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.static("dist"))
app.use(express.json())
app.use(cors())

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get("/", (req, res) => {
    res.send("<h1>Hello world!</h1>")
})

app.get("/api/notes", (req, res) => {
    res.json(notes)
    // console.log("request headers:\n", req.headers)
})

app.get("/api/notes/:id", (req, res) => {
    const id = req.params.id
    const note = notes.find(note => note.id === id)

    if (note) {     // オブジェクトは真値，undefは偽値
        res.json(note)
    } else {
        res.status(404).end()
    }
})

app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id
    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})

app.post("/api/notes", (req, res) => {
    const body = req.body

    if (!body.content) {
        res.status(400).json({
            error: "content missing"
        })
        return
    }

    const note = {
        id: generateId(),
        content: body.content,
        important: body.important || false
    }
    notes.push(note)
    res.json(note)
    console.log(notes)
    // console.log("request headers:\n", req.headers)
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => Number(n.id)))
        : 0
    return String(maxId + 1)
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server runnning on port ${PORT}`)
})
