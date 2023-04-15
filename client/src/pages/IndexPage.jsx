import React, { useEffect, useState } from 'react'
import Post from '../components/Post'

const IndexPage = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('https://blog-app-server-jmfu.onrender.com/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);

  return (
    <div>
      {
        posts.length > 0 && 
        posts.map(post => (
          <Post {...post}  key={post._id}/>
        ))
      }
    </div>
  )
}

export default IndexPage