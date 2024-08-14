import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

const Editor = forwardRef(({ content, setContent }, ref) => {
  const theme = 'snow'
  const modules = {
    toolbar: false
  }
  const placeholder = ''
  const formats = ['list', 'indent']

  const { quill, quillRef } = useQuill({ theme, modules, formats, placeholder });

  useImperativeHandle(ref, () => ({
    getQuillInstance: () => quill
  }), [quill])

  const formatText = () => {
    const editorHTML = quill.root.innerHTML

    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = editorHTML

    let hasInvalidItems = false
    const listItems = Array.from(tempDiv.querySelectorAll('li'))
    listItems.forEach(li => {
      const text = li.innerText.trim()
      if (text.length > 0) {
        if (!text.startsWith('[')
          || (text.split(' ').length > 1 && !text.split(' ')[1].startsWith('['))) {
          hasInvalidItems = true
          li.innerText = `[] [] ${li.innerText.trim()}`
        }
      }
    })
    // check syntax, then auto format
    if (hasInvalidItems) {
      // Update Quill editor with the corrected content
      setTimeout(() => { // FIXME using setTimeout prevent warning: addRange(): The given range isn't in document.
        quill.root.innerHTML = tempDiv.innerHTML
      }, 50)
      setTimeout(() => {
        moveCursorToEnd()
      }, 50)
    }
  }

  const moveCursorToEnd = () => {
    const length = quill.getLength()
    if (length > 0) {
      quill.setSelection(length - 1, 0)
    } else {
      quill.setSelection(0, 0)
    }
  }

  useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        formatText()

        const text = quill.getText()
        setContent(text)
      })

      if (content) {
        quill.clipboard.dangerouslyPasteHTML(content)
      }
    }
  }, [quill, setContent, content])

  return (
    <div style={{ width: 600, height: 200 }}>
      <div ref={quillRef} />
    </div>
  )
})

export default Editor
