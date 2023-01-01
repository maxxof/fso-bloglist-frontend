import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload.sort((a, b) => b.likes - a.likes)
    }
  }
})

export const { appendBlog, setBlogs } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    console.log(newBlog)
    dispatch(appendBlog(newBlog))
  }
}

export const likeBlog = (id, blog) => {
  return async dispatch => {
    const likedBlog = {
      ...blog,
      votes: blog.likes + 1
    }

    await blogService.update(id, likedBlog)
    const updatedBlogs = await blogService.getAll()
    dispatch(setBlogs(updatedBlogs))
  }
}

export const removeBlog = id => {
  return async dispatch => {
    await blogService.deleteBlog(id)
    const updatedBlogs = await blogService.getAll()
    dispatch(setBlogs(updatedBlogs))
  }
}

export default blogSlice.reducer