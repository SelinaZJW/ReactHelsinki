import React, { useState } from 'react'

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const StatisticLine = ({text, result}) => {
  return (
   <tr> 
     <td>{text} </td> 
     <td>{result}</td> 
   </tr>
  )
}

const Statistics = (props) => {

  const {clicks} = props
  const average = (clicks.good - clicks.bad)/(clicks.good  + clicks.neutral + clicks.bad)
  const percentage = (clicks.good)*100/(clicks.good  + clicks.neutral + clicks.bad)

  const percentage_str = `${percentage.toFixed(2)}%`
  const average_str = average.toFixed(2)

  return (
    <div>
      <table style={{border: "1px solid black"}}>
        <tbody>
          <StatisticLine text='good' result={props.clicks.good}/>
          <StatisticLine text='neutral' result={props.clicks.neutral}/>
          <StatisticLine text='bad' result={props.clicks.bad}/>
          <StatisticLine text='average' result={average_str}/>
          <StatisticLine text='percentage' result={percentage_str} />
        </tbody>
      </table>
  </div>
  )
}

const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <div>
      <Statistics clicks={props.clicks}/>
    </div>
  )
}

const App = () => {
  const [clicks, setClicks] = useState({
    good: 0, neutral:0, bad: 0, average:0, percentage:0
  })
  
  const [allClicks, setAll] = useState([])

  const handleGoodClick = () => {
    setClicks(
      { ...clicks, 
        good: clicks.good + 1
      }
      )
    setAll(allClicks.concat('G'))
  }
  const handleNeutralClick = () => {
    setClicks(
      { ...clicks, 
        neutral: clicks.neutral + 1
      }
      )
    setAll(allClicks.concat('N'))
  }
  const handleBadClick = () => {
    setClicks(
      { ...clicks, 
        bad: clicks.bad + 1
      }
    )
    setAll(allClicks.concat('B'))
  }  
  
  //const percentage_str = `${clicks.percentage}%` back quotes ``, not actual single quote''
  //const percentage_str = percentage + "%"

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGoodClick} text='good'/>
      <Button onClick={handleNeutralClick} text='neutral'/>
      <Button onClick={handleBadClick} text='bad'/>
      <h1>statistics</h1>
      <History allClicks={allClicks} clicks={clicks} />
    </div>
  )
}

export default App