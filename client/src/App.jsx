import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import VideoPlayer from './components/VideoPlayer/VideoPlayer'
import Main from './pages/Main/Main'
import Subscription from './pages/Subscription/Subscription'

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/subscriptions' element={<Main />} />
        <Route path='/playlist' element={<Main />} />
        <Route path='/channel/:channelId' element={<Main />} />
        <Route path='/channel/you' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/watch/:videoId' element={<VideoPlayer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
