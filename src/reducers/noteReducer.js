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
    }
  },
})

export const { toggleImportanceOf, setNotes } = noteSlice.actions

export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

export const createNote = (content) => {
  return async (dispatch, getState) => {
    const note = {
      content: content
    }
    const saved = await noteService.save(note)
    const notes = getState().notes
    const newNotes = notes.concat(saved)
    dispatch(setNotes(newNotes))
  }
}

export default noteSlice.reducer
