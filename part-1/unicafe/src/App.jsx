import { useState } from 'react'
import './App.css'

function Button({text}){
  return(
    <button>
      {text}
    </button>
  )
}

function Statistics({text}){
  return(
    <div>
      {text}
    </div>
  )
}


function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button text="good" onClick={handleGood} />
      <Button text="neutral" onClick={handleNeutral}/>
      <Button text="bad" onClick={handleBad}/>
      <h1>Statistics</h1>
      <Statistics text="good" value={good}/>
      <Statistics text="neutral" value={neutral}/>
      <Statistics text="bad" value={bad}/>
      <Statistics text="all" value={good + neutral + bad}/>
      <Statistics text="average" value={(good + neutral + bad) / 3}/>
      <Statistics text="positive" value={good}/>
    </div>
  )
}

export default App
