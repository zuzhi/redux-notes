import { useDispatch } from "react-redux"
import Notes from "./components/Notes"
import { useEffect } from "react"
import { initializeNotes } from "./reducers/noteReducer"

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes())
  }, [])

  return (
    <>
      <Notes/>
    </>
  )
}

export default App
