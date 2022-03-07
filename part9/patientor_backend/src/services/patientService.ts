import { v4 as uuid } from 'uuid';
import patients from '../../data/patients';
import { PatientEntry, PublicPatientEntry, NewPatientEntry, Entry, NewEntry } from '../types';


const getPatients = (): Array<PatientEntry> => {
  return patients;
};

const getPublicPatients = (): Array<PublicPatientEntry> => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id, name, dateOfBirth, gender, occupation 
  }));
};

const findbyId = (id: string): PatientEntry | undefined => {
  const entry = patients.find(p => p.id===id) as PatientEntry;
  return entry;
};

const addPatient = (entry: NewPatientEntry): PatientEntry => {
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };
  patients.push(newPatientEntry);
  
  return newPatientEntry;
};


const addEntry = (entry: NewEntry, id: string): Entry => {
  const patient = patients.find(p => p.id===id) as PatientEntry;
  const entries = patient.entries;
  console.log({id: 1, ...entry});
  const newEntry = {
    id: uuid(),
    ...entry
  };
  console.log(newEntry);
  entries.push(newEntry as Entry);

  return newEntry;
};

export default {
  getPatients,
  addPatient, 
  getPublicPatients, 
  findbyId, 
  addEntry
};