import { useDispatch, useSelector } from "react-redux"
import Notes from "./components/Notes"
import { useEffect, useRef, useState } from "react"
import { initializeNotes } from "./reducers/noteReducer"
import Editor from "./components/Editor"
import NewNote from "./components/NewNote"

const App = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => state.notes)
  const [editorContent, setEditorContent] = useState('')
  const [combinedContent, setCombinedContent] = useState('')

  useEffect(() => {
    dispatch(initializeNotes())
  }, [dispatch])

  // Use a ref to access the quill instance from the child component
  const quillRef = useRef(null)

  const openInEditor = () => {
    console.log(notes)

    const content = `<ul>${notes.map(note =>
      `<li>[${note.id}] [${note.important ? '!' : ''}] ${note.content}</li>`).join("")}</ul>`
    setCombinedContent(content)
  }

  const parseId = (text) => {
    // [id]/[] [!]/[] text
    const id = text.split(' ')[0].replace('[', '').replace(']', '')
    return id === '' ? null : id
  }

  const parseImportant = (text) => {
    // [id]/[] [!]/[] text
    return text.split(' ')[1] === '[!]'
  }

  const parseContent = (text) => {
    // [id]/[] [!]/[] text
    return text.split(' ').slice(2).join(' ')
  }

  const parseNote = (text) => {
    // parse text, extract id, important and content, in form: [id]/[] [!]/[] text
    return {
      id: parseId(text),
      important: parseImportant(text),
      content: parseContent(text)
    }
  }

  const save = () => {
    const quill = quillRef.current?.getQuillInstance()
    if (quill) {
      const editorHTML = quill.root.innerHTML

      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = editorHTML

      let hasInvalidItems = false
      const listItems = Array.from(tempDiv.querySelectorAll('li'))
      listItems.forEach(li => {
        if (!li.innerText.trim().startsWith('[') || !li.innerText.trim().split(' ')[1].startsWith('[')) {
          hasInvalidItems = true
          li.innerText = `[] [] ${li.innerText.trim()}`
        }
      })
      // check syntax, then auto format
      if (hasInvalidItems) {
        // Update Quill editor with the corrected content
        quill.root.innerHTML = tempDiv.innerHTML;
      }
      const extractedNotes = Array.from(tempDiv.querySelectorAll('li')).map(li =>
        parseNote(li.innerText.trim())
      )
      console.log("Extracted Notes Array:", extractedNotes)
    } else {
      console.error("Quill instance is not available.")
    }
  }

  return (
    <>
      <button onClick={openInEditor}>open in editor</button>
      <br />
      <br />
      <NewNote/>
      <Notes/>
      <Editor ref={quillRef} content={combinedContent} setContent={setEditorContent} />
      <button onClick={save}>save</button>
    </>
  )
}

export default App
