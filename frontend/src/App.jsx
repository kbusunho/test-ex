import { useState } from 'react'
import Book from './components/Book'

function App() {
  const [count, setCount] = useState(0)

  return (
      <div>
        <Book />
    </div>
  )
}

export default App
