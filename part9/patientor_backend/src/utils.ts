import { Gender, NewPatientEntry } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!name || !isString (name)) {
    throw new Error('Incorrect or missing name');
  }

  return name;
};

const parseSSN = (ssn: unknown): string => {
  if (!ssn || !isString (ssn)) {
    throw new Error('Incorrect or missing ssn');
  }

  return ssn;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDateOfBirth = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date:' + date);
  }

  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender:' + gender);
  }

  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation:' + occupation);
  }

  return occupation;
};

type Field = { name: unknown, ssn: unknown, dateOfBirth: unknown, gender: unknown, occupation: unknown };

const toNewPatient = ({ name, ssn, dateOfBirth, gender, occupation }: Field): NewPatientEntry => {
  const newEntry: NewPatientEntry = {
    name: parseName(name), 
    dateOfBirth: parseDateOfBirth(dateOfBirth),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ssn: parseSSN(ssn),
    gender: parseGender(gender),
    occupation: parseOccupation(occupation)
  };

  return newEntry;
};

export default toNewPatient;