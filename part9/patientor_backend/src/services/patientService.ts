import { v4 as uuid } from 'uuid';
import patients from '../../data/patients';
import { PatientEntry, NonSensitivePatientEntry, NewPatientEntry } from '../types';

const getPatients = (): Array<PatientEntry> => {
  return patients;
};

const getNonSensitivePatients = (): Array<NonSensitivePatientEntry> => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id, name, dateOfBirth, gender, occupation
  }));
};

// const findbyId = (id: string): PatientEntry | undefined => {
//   const entry = patients.find(p => p.id===id);
//   return entry;
// };

const addPatient = (entry: NewPatientEntry): PatientEntry => {
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };
  patients.push(newPatientEntry);
  
  return newPatientEntry;
};

export default {
  getPatients,
  addPatient, 
  getNonSensitivePatients
};