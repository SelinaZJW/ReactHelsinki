interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

interface ExerciseValues {
  target: number;
  actual: number[];
}

const parseExercises = (args: Array<string>): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const isNumber = (currentValue: any) => !isNaN(Number(currentValue))
  const numberArray = args.slice(2)

  if (numberArray.every(isNumber)) {
    return {
      target: Number(args[2]),
      actual: args.slice(3).map(a => Number(a))
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

const calculateExercises = ( target: number, actual: Array<number> ) => {
  const periodLength = actual.length
  const trainingDays = actual.filter(a => a !== 0).length
  const sum = actual.reduce((partialSum, a) => partialSum + a, 0)
  const average = sum/periodLength
  const success = average >= target ? true : false
  
  const ratingMetrics = () => {
    if (success === true) {
      return {rating: 3, ratingDescription: "you did it!"}
    }
    if (average >= target/2 && average < target) {
      return {rating: 2, ratingDescription: "not too bad but could be better"}
    }
    if (average < target/2) {
      return {rating: 1, ratingDescription: "do better!"}
    }
  }

  return {
    periodLength: periodLength,
    trainingDays: trainingDays,
    success : success,
    target: target,
    average: average,
    ...ratingMetrics()
  }
}

// const target: number = Number(process.argv[2])
// // console.log(process.argv.slice(3).map(a => Number(a)))
// const actual: Array<number> = process.argv.slice(3).map(a => Number(a))
// console.log(target, actual)
// console.log(calculateExercises(target, actual))

// console.log(calculateExercises(2, [3, 0, 2, 4.5, 0, 3, 1]))

try {
  const {target, actual} = parseExercises(process.argv)
  console.log(calculateExercises(target, actual))
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

