import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'

let blog

beforeEach(() => {
  blog = {
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 100,
    user: {
      username: 'maxxof',
      name: 'max'
    }
  }
})

test('Blog renders blog`s title and author by default', () => {

  const { container } = render(<Blog blog={blog} />)
  const element = screen.getByText('title author')
  expect(element).toBeDefined()
  const div = container.querySelector('.blog')
  expect(div).not.toHaveTextContent('url')
  expect(div).not.toHaveTextContent(100)
})

test('Blog also renders blog´s url and likes when the view-button is clicked', async () => {


  const { container } = render(<Blog blog={blog} />)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('url')
  expect(div).toHaveTextContent(100)
})

test('clicking the like button twice calls event handler twice', async () => {
  const mockHandler = jest.fn()

  render (<Blog blog={blog} updateBlog={mockHandler}/>)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})