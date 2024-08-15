import { createSlice, current } from "@reduxjs/toolkit"
import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find(n => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
      console.log(current(state))
      return state.map(note =>
        note.id !== id ? note : changedNote
      )
    },
    setNotes(state, action) {
      return action.payload
    },
    appendNotes(state, action) {
      const newNotes = action.payload
      return state.concat(newNotes)
    },
    deleteNotes(state, action) {
      const notesToDelete = action.payload
      return state.filter(note => !notesToDelete.some(d => d.id === note.id))
    },
    updateNotes(state, action) {
      const updatedNotes = action.payload
      return state.map(note =>
        updatedNotes.some(u => u.id === note.id)
          ? { ...note, ...updatedNotes.find(u => u.id === note.id) }
          : note
      )
    },
  },
})

export const { toggleImportanceOf, setNotes, appendNotes, deleteNotes, updateNotes } = noteSlice.actions

export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

export const createNote = (content) => {
  return async (dispatch, getState) => {
    const saved = await noteService.save(content)
    const notes = getState().notes
    const newNotes = notes.concat(saved)
    dispatch(setNotes(newNotes))
  }
}

export const saveAll = (newNotes) => {
  return async (dispatch, getState) => {
    const notes = getState().notes
    // group by 'toCreate', 'toDelete', 'toUpdate'
    // case 'toCreate', those id is null
    const toCreate = newNotes.filter(note => note.id === null)
    console.log("To Create:", toCreate)
    // case 'toDelete', those removed
    const toDelete = notes.filter(note =>
      !newNotes.some(extracted => extracted.id === note.id))
    // case 'toUpdate', those important/content is modified
    console.log("To Delete:", toDelete)
    const toUpdate = newNotes.filter(note =>
      notes.some(existing => existing.id === note.id &&
        (existing.important !== note.important || existing.content !== note.content))
    )
    console.log("To Update:", toUpdate)

    dispatch(appendNotes(toCreate))
    toCreate.forEach(async (note) => {
      await noteService.saveNote(note.content, note.important)
    })
    dispatch(deleteNotes(toDelete))
    toDelete.forEach(async (note) => {
      await noteService.deleteNote(note.id)
    })
    dispatch(updateNotes(toUpdate))
    toUpdate.forEach(async (note) => {
      await noteService.updateNote(note)
    })
  }
}

export default noteSlice.reducer
