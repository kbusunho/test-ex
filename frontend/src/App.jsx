import { useState } from 'react'
import Book from '../../backend/models/Book'

function App() {
  const [count, setCount] = useState(0)

  return (
      <div>
        <Book />
    </div>
  )
}

export default App
