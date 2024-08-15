import axios from "axios"

const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const saveNote = async (content, important = false) => {
  const note = {
    content: content,
    important
  }
  const response = await axios.post(baseUrl, note)
  return response.data
}

const updateNote = async (note) => {
  const response = await axios.patch(`${baseUrl}/${note.id}`, note)
  return response.data
}

const deleteNote = async (id) => {
  await axios.delete(`${baseUrl}/${id}`)
}

export default {
  getAll,
  saveNote,
  updateNote,
  deleteNote
}
