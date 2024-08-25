import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { RouterPaths } from './router/Router'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterPaths />
    </>
  )
}

export default App
