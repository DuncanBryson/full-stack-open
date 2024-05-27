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
export default Course