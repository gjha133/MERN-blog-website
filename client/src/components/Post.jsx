import React from 'react'
import {formatISO9075} from 'date-fns'
import { Link } from 'react-router-dom'

const Post = ({_id, title, summary, cover, createdAt, author }) => {
  
  let Title = title.length >= 80 ? `${title.substr(0, 80)}...` : title
  let Summary = summary.length >= 240 ? `${summary.substr(0, 240)}...` : summary

  return (
    <div className="post">
      <div className="image">
      <Link to={`/post/${_id}`} >
        <img src={'http://localhost:4000/'+cover} alt=""/>
      </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`} >
          <h2>{Title}</h2>
        </Link>
        <p className="info">
          <a className="author" title='author' >{author.username}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className='summary' >{Summary}</p>
      </div>
    </div>
  )
}

export default Post