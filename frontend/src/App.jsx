import "./index.css"
import Note from './components/Note'
import { useState, useEffect } from 'react'
import noteService from "./service/notes"
import Notification from "./components/Notification"
import Footer from "./components/Footer"

const App = () => {
  console.log("rendered")
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMsg, setErrMsg] = useState(null)

  const importantNotes = notes.filter((note) => note.important)

  const notesToShow = showAll ? notes : importantNotes
  
  useEffect(() => {
    console.log("effect start");
    noteService
      .getAll()
      .then(initNotes => {
        console.log("got notes first time\n", initNotes);
        setNotes(initNotes)  // notes state の情報源A
      })
  }, [])

  // これは onClick の値=ハンドラそのもの,ではない
  // 匿名関数がハンドラで，その内部でidを実引数として渡されてこれが呼び出される
  // いわばハンドラ内部の補助関数?
  const toggleImportanceOf = (id) => {
    // selectNoteをtoggledNoteでPUTメソッドリクエストで置換
    const selectNote = notes.find(note => note.id === id)
    const toggledNote = {
      ...selectNote,
      important: !selectNote.important
    }

    noteService
      .update(id, toggledNote)
      .then(resNote => {
        console.log("changed note", resNote, resNote.id, selectNote.id)
        setNotes(notes.map(note =>
          note.id === id ? resNote : note  // notes state の情報源C
        ))
      })
      .catch(e => {  // selectNoteが既にサーバーに存在しなかった場合のハンドラ
        console.log("test eeror", e)
        setErrMsg(`the select note ${selectNote.content} was already deleted from server`)
        setTimeout(()=>setErrMsg(null), 5000)
        setNotes(notes.filter(note => note.id !== id))
      })
  }

  const addNote = (e) => {
    e.preventDefault()
    if (newNote === "") {
      alert("invalid content")
      return
    }

    const noteObject = {
      // id はサーバー側で生成
      // ロジックはjson-serverが自動設定
      content: newNote,
      important: Math.random() < 0.5
    }

    noteService
      .create(noteObject)
      .then(resNote => {
        console.log("note added", resNote)
        setNotes(notes.concat(resNote)) // notes state の情報源B
        setNewNote("")
      })
  }
  
  const handleNoteChange = (e) => {
    console.log(e.target.value);
    setNewNote(e.target.value)
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMsg} />
      <div>
        <button onClick={()=>{setShowAll(!showAll)}}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={()=>{toggleImportanceOf(note.id)}}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
      <Footer></Footer>
    </div>
  )
}

export default App