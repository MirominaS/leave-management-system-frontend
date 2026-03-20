import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Route ,Routes} from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employee from './pages/Employee'
import LeaveRequests from './pages/LeaveRequests'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Login/>}/>
        <Route path = "/dashboard" element = {<Dashboard/>}/>
        <Route path = "/employee" element = {<Employee/>}/>
        <Route path = "/leave-request" element = {<LeaveRequests/>}/>
      </Routes>
    </BrowserRouter>
  )
}


export default App
