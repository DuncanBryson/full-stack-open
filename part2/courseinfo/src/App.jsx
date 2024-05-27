const Course = ({courses}) => (
  <>
  {courses.map((course)=>{
    return(
    <div key={course.id}>
      <h2>{course.name}</h2>
      {course.parts.map((c)=>
        <p key={c.id}>
          {c.name} {c.exercises} 
        </p>
      )}
      <h3 key={"total" + course.id}>
        Total of {course.parts.reduce(((sum, part)=>
         sum += part.exercises),0)} exercises
      </h3>
    </div>
)})}
  </>
)

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return <Course courses={courses} />
}

export default App