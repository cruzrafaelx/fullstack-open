
export default function App() {
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
     <Header course ={course.name}/>
     <Content part={course.parts[0].name} exercises={course.parts[0].exercises}/>
     <Content part={course.parts[1].name} exercises={course.parts[1].exercises}/>
     <Content part={course.parts[2].name} exercises={course.parts[2].exercises}/>
     <Total total={course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises}/>
    </div>
  )
}

const Header = (props) => {
  
  return (
    <div>Course: {props.course}</div>
  )
}
const Content = (props) => {
  return (
    <div>
      <p>Part: {props.part}</p>
      <p>Exercises: {props.exercises}</p>
    </div>
  )
}
const Total = (props) => {
  return (
    <div>
      Total exercises: {props.total}
    </div>
  )
}

