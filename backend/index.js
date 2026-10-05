// commonJSモジュールによるimport
const express = require("express")
const app = express()

app.use(express.static("dist"))
app.use(express.json())

const mongoose = require('mongoose')

// ネットワーク問題のローカルな回避策．いずれ削除予定
const dns = require('node:dns')
dns.setServers(['1.1.1.1'])

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://8126502_db_user:${password}@cluster0.rhy7fxe.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})
noteSchema.set("toJSON", {
    transform: (doc, ret) => {
        console.log("--transform called--")
        console.log("original document:", doc)
        console.log("returned object:", ret)
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

const Note = mongoose.model('Note', noteSchema)

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
    console.log("--route handler called--")
    Note.find({}).then(notes => {
        console.log("got notes from database: ", notes)
        res.json(notes)
    })
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
