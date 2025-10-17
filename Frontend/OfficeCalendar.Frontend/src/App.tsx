import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/login/Login'
import Registreer from './pages/register/Registreer'
import Forgot_Password from './pages/forgot-password/Forgot-Password'
import Main_Page from './pages/main-page/Main-Page'
import Messages from './pages/messages/Messages'
import SingleMessage from './pages/singlemessage/SingleMessage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registreer" element={<Registreer />} />
        <Route path="/forgot-pw" element={<Forgot_Password />} />
        <Route path="/main-page" element={<Main_Page />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:messageID" element={<SingleMessage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
