import React from 'react';

const Header = ({courseName}: {courseName: string}) => {
  return <h1>{courseName}</h1>;
};

interface CoursePartsProps {
  courseParts: Array<{name: string, exerciseCount: number}>
}

const Content = (props: CoursePartsProps) => {
  return <> {props.courseParts.map((c: any) => 
     <p key={c.name}>{c.name} {c.exerciseCount}</p>
  )} </>;
};

const Total = (props: CoursePartsProps) => {
  return (
    <p>
      Number of exercises{" "}
      {props.courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  )
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts}/>
    </div>
  );
};

export default App;