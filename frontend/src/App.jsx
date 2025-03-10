import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmitHandler = () => {
      axios.post(`${import.meta.env.VITE_BACKENDURL}/signup`, {
        username, email, password
      })
  }

  return (
    <div>
      <input onChange={(e)=>{setUsername(e.target.value)}} type="text" name="username" id="username" placeholder='Enter a username for your profile' />
      <input onChange={(e)=>{setEmail(e.target.value)}} type="text" name="email" id="email" placeholder='Enter your email'/>
      <input onChange={(e)=>{setPassword(e.target.value)}} type="password" name="password" id="password" placeholder='Enter a password for your profile'/>
      <button onClick={onSubmitHandler}>Submit</button>
    </div>
  )
}

export default App
