import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

const Header = () => {

  const { setUserInfo, userInfo } = useContext(UserContext)

  useEffect(() => {
    fetch('https://blog-app-server-jmfu.onrender.com/profile', {
      credentials: 'include'
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo)
      })
    })
  
  }, [])

  function logout() {
    fetch('https://blog-app-server-jmfu.onrender.com/logout', {
      credentials: 'include',
      method: 'POST',
    })
    setUserInfo(null)
  }
  
  const username = userInfo?.username

  return (
    <header>
      <Link to={'/'} className='logo'>
        MyBlog
      </Link>
      <nav>
        {
          username ? (
            <>
              <span>Hello, {username} </span>
              <Link to={'/create'}>Create new post</Link>
              <a onClick={logout}>Logout</a>
            </>
          ) : (
            <>
              <Link to={'/login'}>Login</Link>
              <Link to={'/register'}>Register</Link>
            </>
          )
        }
      </nav>
    </header>
  )
}

export default Header