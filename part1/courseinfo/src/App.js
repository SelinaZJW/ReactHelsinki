
import React from 'react'

const Header = (props) => {
  console.log(props)
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Part = (props) => { 
  return (
    <div>
      <p>{props.name}: {props.exercises}</p>
    </div>
  )
}

const Content = (props) => {
  
  return (
    <div>
      {props.parts.map(p => <Part key={p.name} name={p.name} exercises={p.exercises}/>)}
      
    </div>
  )
}

const Total = (props) => {
  const ex = props.parts.map(p => p.exercises)
  //const [ex1, ex2, ex3] = ex
  //const sum = ex1 + ex2 + ex3
  
  //const sum = ex[0] + ex[1] + ex[2] 
  
  //const reducer = (a, b) => a + b;
  //const sum = ex.reduce(reducer)

  //const sum = ex.reduce((a, b)=> a + b)

  //let sum = 0
  //ex.forEach(e => {
  //  sum = sum + e
  //})

  let sum = 0
  for (let i = 0; i < ex.length; i++) {
    sum = sum + ex[i]
  }

  return (
    <div>
      <p>Number of exercises: {sum} </p>
    </div>
  )
}

const App = () => {
  
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} /> 
      <Content parts= {course.parts}/>
      <Total parts={course.parts} />
    </div>
  )

}

export default App


