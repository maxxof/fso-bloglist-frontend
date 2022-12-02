import { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {
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

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleView}>{buttonLabel}</button>
      {fullView === true ?
        <div>
          <p>{blog.url}</p>
          <p>likes {blog.likes}<button onClick={handleLike}>like</button></p>
          <p>{blog.user.name}</p>
        </div>
        :
        ''
      }
    </div>  
  )
}

export default Blog