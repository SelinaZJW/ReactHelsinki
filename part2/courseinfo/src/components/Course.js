import React from 'react'

const Header = ({name}) => {
  return (
    <div>
      <h2>{name}</h2>
    </div>
  )
}

const Part = ({name, exercises}) => { 
  return (
    <div>
      <li>{name}: {exercises}</li>
    </div>
  )
}

const Content = ({parts}) => {
  
  return (
    <div>
      <ul>
        {parts.map(p => <Part key={p.id} name={p.name} exercises={p.exercises}/>)}
      </ul>
    </div>
  )
}

const Total = ({parts}) => {
  const ex = parts.map(p => p.exercises)

  const reducer = (a, b) => a + b;
  const sum = ex.reduce(reducer)

  return (
    <div>
      <h3>Number of exercises: {sum} </h3>
    </div>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header name={course.name} /> 
      <Content parts= {course.parts}/>
      <Total parts={course.parts} />
    </div>
  )
}

export default Course