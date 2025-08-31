import { useState } from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import MainView from './MainView.jsx'
import { Box } from '@mui/material'
import './App.css'

function App() {
  const [brutAnnuel, setBrutAnnuel] = useState('55000')
  const [isCadre, setIsCadre] = useState(true)

  return (
    <Box className="container">
      <Header />
      <MainView
        brutAnnuel={brutAnnuel}
        setBrutAnnuel={setBrutAnnuel}
        isCadre={isCadre}
        setIsCadre={setIsCadre}
      />
      <Footer />
    </Box>
  )
}

export default App
