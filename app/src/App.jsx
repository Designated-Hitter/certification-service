import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


import Header from './pages/Header';
import Login from './pages/Login';
import Footer from './pages/Footer';

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
