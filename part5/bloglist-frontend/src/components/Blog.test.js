import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

test('renders only title and author by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'admin',
    url: 'http://tedious-hey.com',
    likes: 2,
    user:  [
      {
        username: 'SelinaZzz',
        name: 'Selina Zheng',
        id: '61f5b4e3ecf0cf09e2549083'
      }
    ],
  }

  const user = {
    username: 'SelinaZzz',
    name: 'Selina Zheng',
    id: '61f5b4e3ecf0cf09e2549083'
  }

  const component = render(
    <Blog blog={blog} user={user} />
  )

  const blogDefault = component.container.querySelector('.blogDefault')
  expect(blogDefault).toHaveTextContent('Component testing is done with react-testing-library')
  expect(blogDefault).toHaveTextContent('admin')
  expect(blogDefault).not.toHaveTextContent('http://tedious-hey.com')
  expect(blogDefault).not.toHaveValue(2)

})

test('clicking the view button renders url and likes', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'admin',
    url: 'http://tedious-hey.com',
    likes: 2,
    user:  [
      {
        username: 'SelinaZzz',
        name: 'Selina Zheng',
        id: '61f5b4e3ecf0cf09e2549083'
      }
    ],
  }

  //const mockHandler = jest.fn()

  const user = {
    username: 'SelinaZzz',
    name: 'Selina Zheng',
    id: '61f5b4e3ecf0cf09e2549083'
  }

  const component = render(
    <Blog blog={blog} user={user} />
  )

  const button = component.getByText('view')
  fireEvent.click(button)

  const blogDetails = component.container.querySelector('.blogDetails')
  expect(blogDetails).toHaveTextContent('http://tedious-hey.com')
  expect(blogDetails).toHaveTextContent('2')

})

test('event handler for updating likes is clicked twice, when like button is clicked twice', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'admin',
    url: 'http://tedious-hey.com',
    likes: 2,
    user:  [
      {
        username: 'SelinaZzz',
        name: 'Selina Zheng',
        id: '61f5b4e3ecf0cf09e2549083'
      }
    ],
  }
  const user = {
    username: 'SelinaZzz',
    name: 'Selina Zheng',
    id: '61f5b4e3ecf0cf09e2549083'
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} user={user} updateLikes={mockHandler} />
  )

  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)

})