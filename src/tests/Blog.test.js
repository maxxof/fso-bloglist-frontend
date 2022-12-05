import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'

test('Blog renders blog`s title and author by default', () => {
  const blog = {
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 100
  }
  const { container } = render(<Blog blog={blog} />)
  const element = screen.getByText('title author')
  expect(element).toBeDefined()
  const div = container.querySelector('.blog')
  expect(div).not.toHaveTextContent('url')
  expect(div).not.toHaveTextContent(100)
})