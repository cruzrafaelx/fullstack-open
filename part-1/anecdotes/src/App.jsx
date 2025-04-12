import { useState } from 'react'
import './App.css'

function App() {

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const [highestVote, setHighestVote] = useState(0)
  const [highestIndex, setHighestIndex] = useState(0)
  const [highestAnecdote, setHighestAnecdote] = useState()

 
  const randomNumber = () => Math.floor(Math.random() * anecdotes.length)
  const handleClick = () => {
    setSelected(randomNumber())
  }
  
 console.log("updated votes", votes)
 console.log("updated highest votes", highestVote)
 console.log("updated highest index", highestIndex)
 console.log("highest anecdote", anecdotes[highestIndex])
  
  const handleVote = () => {
    const updatedVotes = [...votes]
    updatedVotes[selected] += 1
    setVotes(updatedVotes)
   
    const highestVoteNew = Math.max(...updatedVotes)
    setHighestVote(highestVoteNew)
   
    const highestIndexNew = updatedVotes.indexOf(highestVoteNew)
    setHighestIndex(highestIndexNew)

  }


  return (
    <>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>{`This anecdote has ${votes[selected]} vote${votes[selected] === 1 ? "" : "s"}`}</p>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleClick}>anecdote</button>
      <h1>Anecdote with the most vote</h1>
      <p>{`${anecdotes[highestIndex]} has ${highestVote} votes`}</p>
    </>
  )
}

export default App
