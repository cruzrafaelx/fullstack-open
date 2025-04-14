const Course = ({course}) => {

 
  const parts = course.parts
  const renderParts = parts.map(parts => {
    return <Content part={parts.name} exercises={parts.exercises} key={parts.id}/>
  })
  const total = parts.map( num => num.exercises)
                .reduce((acc, cur) => acc + cur)

  console.log(total)


  return(
    <div>
     <Header course={course.name}/>
     {renderParts}
     <Total total={total}/>
     </div>
  )
}   

const Header = (props) => {
    return (
      <h1>Course: {props.course}</h1>
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

export default Course