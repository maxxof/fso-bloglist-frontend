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
      return action.payload
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
    dispatch(appendBlog(newBlog))
  }
}

export const like = blog => {
  return async dispatch => {
    const likedBlog = {
      ...blog,
      votes: blog.likes + 1
    }

    await blogService.update(blog.id, likedBlog)
    const updatedBlogs = await blogService.getAll()
    dispatch(setBlogs(updatedBlogs))
  }
}

export default blogSlice.reducer