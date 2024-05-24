const Header = (props) => {
  return (
  <h1>{props.course}</h1>
)
}

const Content = (props) => {
  return (
    <>
      <p>{props.part[0]} {props.exercises[0]}</p>
      <p>{props.part[1]} {props.exercises[1]}</p>
      <p>{props.part[2]} {props.exercises[2]}</p>
    </>
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.exercises1 + props.exercises2 + props.exercises3}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part = ['Fundamentals of React', 'Using props to pass data', 'State of a component']
  const exercises = [10, 7, 14]

  return (
    <>
      <Header course = {course} />
      <Content part = {part} exercises = {exercises}/>
      <Total exercises1 = {exercises[0]} exercises2 = {exercises[1]} exercises3 = {exercises[2]}/>
    </>
  )
}

export default App