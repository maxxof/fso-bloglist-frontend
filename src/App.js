import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import UsersList from './components/Users'
import User from './components/User'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

import { initializeBlogs, createBlog, likeBlog, removeBlog } from './reducers/blogReducer'
import { setNotification } from './reducers/notificationReducer'
import { setUser } from './reducers/userReducer'

import {
  Routes,
  Route,
  useMatch,
  // Link,
  // Navigate,
  // useParams,
  // useNavigate,
} from 'react-router-dom'


const App = () => {
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  userService.getAll()
    .then(response => setUsers(response))

  useEffect(() => {
    dispatch(initializeBlogs()) 
  }, [dispatch]) 

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
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
      dispatch(setUser(user))
      dispatch(setNotification(null))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('wrong username or password'))
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
    dispatch(setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`))
  }

  const updateBlog = async (id, blogObject) => {
    dispatch(likeBlog(id, blogObject))
  }

  const deleteBlog = async id => {
    dispatch(removeBlog(id))
  }
  
  const logout = () => {
    window.localStorage.clear()
    dispatch(setUser(null))
    dispatch(setNotification(null))
  }
  
  const blogFormRef = useRef()

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

  const match = useMatch('/users/:id')
  const blogger = match
    ? users.find(user => user.id === match.params.id)
    : null

  return (
    <div>
      {user === null
        ?
        <div>
          <h2><b>log in to application</b></h2>
          <Notification message={notification} color={'red'}/>
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
          <Notification message={notification} color={'green'}/>
          <p>{user.name} logged in</p>
          <p><button onClick={logout}>logout</button></p>

          <Routes>
            <Route path="/" element={
              <>
                <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                  <BlogForm createBlog={addBlog} />
                </Togglable>
                {blogsRenderer()}
              </>
            } />
            <Route path="/users" element={<UsersList users={users} />} />
            <Route path="/users/:id" element={<User user={blogger}/>} />
          </Routes>
        </div>
      }
    </div>
  )
}

export default App
