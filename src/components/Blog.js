import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, username, deleteBlog }) => {
  const [fullView, setFullView] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('view')
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleView = () => {
    setFullView(!fullView)
    fullView === true ?
      setButtonLabel('view') :
      setButtonLabel('hide')
  }

  const handleLike = (event) => {
    event.preventDefault()
    updateBlog(blog.id, {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    })
  }

  const handleDelete = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleView}>{buttonLabel}</button>
      {fullView === true ?
        <div>
          <p>{blog.url}</p>
          <p>likes {blog.likes}<button onClick={handleLike}>like</button></p>
          <p>{blog.user.name}</p>
          {username === blog.user.username ?
            <button onClick={handleDelete}>remove</button> :
            ''
          }
        </div>
        :
        ''
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  deleteBlog: PropTypes.func.isRequired
}

export default Blog