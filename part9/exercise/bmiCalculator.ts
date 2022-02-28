interface MultiplyValues {
  height: number;
  weight: number;
}

const parseArguments = (args: Array<string>): MultiplyValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}


const calculateBmi = (height: number, weight : number ) => {
  const bmiInit = weight / ((height/100)^2);
  const bmi = bmiInit
  //const bmi = (Math.round(bmiInit * 100) / 100).toFixed(1);

  if (bmi < 16 ) {
    return 'Underweight (Severe thinness)'
  }
  if ( 16 <= bmi &&  bmi < 17 ) {
    return 'Underweight (Moderate thinness)'
  }
  if ( 17 <= bmi && bmi < 18.5) {
    return 'Underweight (Mild thinness)'
  }
  if ( 18.5 <= bmi && bmi < 25 ) {
    return 'Normal (healthy weight)'
  }
  if (25 <= bmi && bmi < 30) {
    return 'Overweight (Pre-obese)'
  }
  if (bmi >= 30) {
    return 'Obese'
  }
}

//console.log(calculateBmi(180, 74))

// const height: number = Number(process.argv[2])
// const weight: number = Number(process.argv[3])
// console.log(calculateBmi(height, weight))

try {
  const {height, weight} = parseArguments(process.argv)
  console.log(calculateBmi(height, weight))
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

