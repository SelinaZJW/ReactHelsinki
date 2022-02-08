import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import NewBlogForm from './NewBlogForm'

test('<NewBlogForm /> updates parent state and calls createBlog', () => {
  const createBlog = jest.fn()

  const component = render(
    <NewBlogForm createBlog={createBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'testing forms' } })
  fireEvent.change(author, {
    target: { value: 'admin' } })
  fireEvent.change(url, {
    target: { value: 'http://testing-is-no-fun.com' } })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0].title).toBe('testing forms')
  expect(createBlog.mock.calls[0][0].author).toBe('admin')
  expect(createBlog.mock.calls[0][0].url).toBe('http://testing-is-no-fun.com')
})