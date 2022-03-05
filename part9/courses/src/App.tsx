import React from 'react';

const Header = ({courseName}: {courseName: string}) => {
  return <h1>{courseName}</h1>;
};

interface CoursePartsProps {
  courseParts: Array<{name: string, exerciseCount: number}>
}

interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CourseExtendedBase extends CoursePartBase {
  description: string
}

interface CourseNormalPart extends CourseExtendedBase{
  type: "normal";
}
interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CourseExtendedBase {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseSpecialPart extends CourseExtendedBase {
  type: "special";
  requirements: string[]
}

type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseSpecialPart;
type CourseParts = {
  courseParts: Array<CoursePart>
}

const Part = (part: CoursePart) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  let el;

  switch (part.type) {
    case "normal": 
      el = <li><i>{part.description}</i></li>
      break;
    case "groupProject":
      el = <li><i>project exercises {part.groupProjectCount}</i></li>
      break;
    case "submission":
      el = <><li><i>{part.description}</i></li><li>submit to {part.exerciseSubmissionLink}</li></>
      break;
    case "special":
      el = <><li><i>{part.description}</i></li><li>required skills: {part.requirements.join(', ')}</li></>
      break;
    default:
      return assertNever(part);
  }

  return (
    <ul style={{ listStyleType: "none" }}>
      <li>
        <strong>{part.name} {part.exerciseCount}</strong>
      </li>
      {el}
    </ul>
  )
}


const Content = (props: CourseParts) => {
  return <> {props.courseParts.map((c: CoursePart) => 
    <Part {...c} key={c.name}/>
    //  <p key={c.name}>{c.name} {c.exerciseCount}</p>
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
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is the leisured course part",
      type: "normal"
    },
    {
      name: "Advanced",
      exerciseCount: 7,
      description: "This is the harded course part",
      type: "normal"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      type: "groupProject"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
      type: "submission"
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      type: "special"
    }
  ]

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts}/>
    </div>
  );
};

export default App;