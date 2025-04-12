import { useState } from 'react'
import './App.css'

function Button({text, onClick}){
  return(
    <td>
      <button onClick={onClick}>
        {text}
      </button>
    </td>
  )
}

function Statistics({text, value}){
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}


function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  const handleGood = () => {
    setGood(good + 1)
    setAll(all + 1)
  }
  
  const handleNeutral = () => {
    setNeutral(neutral + 1)
    setAll(all + 1)
  }

  const handleBad = () => {
    setBad(bad + 1)
    setAll(all + 1)
  }

  console.log(good, neutral, bad, all)

  return (
    <table>
      <tbody>
      <tr>
        <td colSpan={3}>
          <h1>give feedback</h1>
        </td>
      </tr>

      <tr>
          <Button text="good" onClick={handleGood} />
          <Button text="neutral" onClick={handleNeutral}/>
          <Button text="bad" onClick={handleBad}/>
      </tr>
      
      <tr>
        <td colSpan={3}>
          <h1>statistics</h1>
        </td>
      </tr>

      {all ? (
        <>
        <Statistics text="good" value={good}/>
        <Statistics text="neutral" value={neutral}/>
        <Statistics text="bad" value={bad}/>
        <Statistics text="all" value={all}/>
        <Statistics text="average" value={parseFloat((good - bad )/ all).toFixed(2)}/>
        <Statistics text="positive" value={`${parseFloat(good / all).toFixed(2)}%`}/>
        </>
      ) : (
        <tr>
          <td colSpan={2}>No feedback given</td>
        </tr>
      )}
      </tbody>
    </table>
  )
}

export default App
