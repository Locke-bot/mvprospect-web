import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LogIn from "./pages/Login"
import Tabs from "./pages/Tabs";

import './App.scss'

export default function App() {
  let authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={authTokens ? <Tabs /> : <LogIn />} />
          <Route element={<LogIn />} />
        </Routes>
    </Router>
  )
}