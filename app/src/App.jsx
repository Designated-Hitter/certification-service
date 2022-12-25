import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


import Header from './pages/Header.js';
import Login from './pages/Login.js';
import Footer from './pages/Footer.js';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      
      <Header />
      <Login />
      <Footer />

    </div>
  )
}

export default App
