require("dotenv").config()  // .envの環境変数がグローバルに利用可能になる
const express = require("express")
const Note = require('./models/note')

const app = express()

app.use(express.static("dist"))
app.use(express.json())

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

app.get("/api/notes/:id", (req, res, next) => {
    const id = req.params.id
    Note.findById(id)
        .then(note => {
            if (!note) {
                return res.status(404).end()
            }
            console.log("note found:\n", note)
            res.json(note)
        })
        .catch(e => {
            next(e)
        })
})

app.delete("/api/notes/:id", (req, res, next) => {
    const id = req.params.id
    Note.findByIdAndDelete(id)
        .then(result => {
            res.status(204).end()
        })
        .catch(e => next(e))
})

app.post("/api/notes", (req, res, next) => {
    const body = req.body

    const note = new Note({
        content: body.content,
        important: body.important || false
    })
    
    note.save()
        .then(savedNote => {
            console.log("note was saved in DB:\n", savedNote)
            res.json(savedNote)
        })
        .catch(e => next(e))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})

// 404 handler
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// error handler
const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === "CastError") {
        return res.status(400).json({ error: "malformatted id" })
    }

    if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server runnning on port ${PORT}...`)
})
