import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null) 
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBloglistappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setMessage(null)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const newBlog = await blogService.create(blogObject)
    console.log(newBlog)      
    setBlogs(blogs.concat(newBlog))
    setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const updateBlog = async (id, blogObject) => {
    const updatedBlog = await blogService.update(id, blogObject)
    const updatedBlogs = blogs.map(blog => blog.id !== id ? blog : updatedBlog)
    setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
  }

  const deleteBlog = async id => {
    await blogService.deleteBlog(id)
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const blogsRenderer = () => (
    <div>
        {blogs.map(blog =>
          <Blog key={blog.id} 
            blog={blog} 
            updateBlog={updateBlog} 
            deleteBlog={deleteBlog} 
            username={user.username}/>
          )}
    </div>
  )
  
  const logout = () => {
    window.localStorage.clear()
    setUser(null)
    setMessage(null)
  }

  const blogFormRef = useRef()

  return (
    <div>
      {user === null 
        ?
        <div>
          <h2><b>log in to application</b></h2>
          <Notification message={message} color={'red'}/>
          <LoginForm 
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}/>
        </div>
        :
        <div>
          <h2><b>blogs</b></h2>
          <Notification message={message} color={'green'}/>
          <p>{user.name} logged in
          <button onClick={logout}>logout</button>
          </p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogsRenderer()}
        </div>
      }
    </div>
  )
}

export default App
