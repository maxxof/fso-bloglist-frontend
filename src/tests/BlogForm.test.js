import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../components/BlogForm'

test('BlogForm calls event handler with the right details when a new blog is created', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()
  render(<BlogForm createBlog={createBlog}/>)

  const createButton = screen.getByText('create')

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  
  await userEvent.type(titleInput, 'title...')
  await userEvent.type(authorInput, 'author...')
  await userEvent.type(urlInput, 'url...')
  await user.click(createButton)

  expect(createBlog.mock.calls[0][0].title).toBe('title...')
  expect(createBlog.mock.calls[0][0].author).toBe('author...')
  expect(createBlog.mock.calls[0][0].url).toBe('url...')
})