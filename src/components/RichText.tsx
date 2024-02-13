import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../contexts/AppContext'

const RichText: React.FC = () => {
    
  const quillRef = useRef(null)
  const [quill, setQuill] = useState(null)

  const { reload } = useAppContext()

  useEffect(() => {
    console.log(quillRef)
    if (quillRef.current) {
      console.log('TEST')
      setQuill(new Quill(quillRef.current, {
        theme: 'snow'
      }))
    }
    return () => {
      
    }
  }, [reload])

  return (
    <>
      <div ref={quillRef} />
    </>
  )
}

export default RichText