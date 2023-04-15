import React, { useState } from 'react'

const RegisterPage = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function register(e) {
    e.preventDefault();
    const response = await fetch('https://blog-app-server-jmfu.onrender.com/register', {
      method: 'POST',
      body: JSON.stringify({
        username, 
        password
      }),
      headers: {'Content-Type' : 'application/json'},
    })
    if(response.status === 200) {
      alert('Registration Succesful!')
    } else {
      alert('Registration Failed!')
    }
  }

  return (
    <form className='register' onSubmit={register} >
      <h1>Register</h1>
      <input 
        type="text" 
        name="username" 
        placeholder='Username' 
        value={username} 
        onChange={e => setUsername(e.target.value)}
      />
      <input 
        type="password" 
        name="password" 
        placeholder='Password' 
        value={password} 
        onChange={e => setPassword(e.target.value)}
      />
      <button>Register</button>
    </form>
  )
}

export default RegisterPage