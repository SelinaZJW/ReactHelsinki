/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from 'express';
// import * as express from 'express';
const app = express();
app.use(express.json());
import { calculateBmi, parseBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});


app.get('/bmi', (req, res) => {
  try {
    if (!req.query.height || !req.query.weight) {
      throw new Error('malformatted parameters');
    }
    //how to throw error for missing parameter, put throw error into try, so that catch can recognise the error
    const parameters = [Number(req.query.height), Number(req.query.weight)];

    const {height, weight} = parseBmi(parameters);
    const bmi = calculateBmi(height, weight);
    const response = {height: height, weight: weight, bmi: bmi};
    res.send(response);
  } catch (error: unknown) {
    let errorMessage = "";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // eslint-disable-next-line no-ex-assign
    error = {error: errorMessage} ;
    res.send(error);
  }
});


app.post('/exercises', (request, response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {daily_exercises, target} = request.body;
  const isNumber = (currentValue: string) => !isNaN(Number(currentValue));
  //console.log(daily_exercises.every(isNumber))
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (daily_exercises.length ===0 || target === "") {
      throw new Error('parameters missing');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!daily_exercises.every(isNumber) || !isNumber(target)) {
      throw new Error('malformatted parameters');
    }

    const result = calculateExercises(target, daily_exercises);
    response.send(result);
  } catch (error: unknown) {
    let errorMessage = "";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // eslint-disable-next-line no-ex-assign
    error = {error: errorMessage};
    response.send(error);
  }
  
  // const result = calculateExercises(target, daily_exercises)
  // console.log(result)
  // // const body = request.body
  // // console.log(request.body)
  // // console.log(body)
  // response.send(result)
});


const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});