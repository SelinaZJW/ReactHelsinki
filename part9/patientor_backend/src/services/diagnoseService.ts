import diagnoses from '../../data/diagnoses';
import { DiagnoseEntry } from '../types';

const getDiagnoses = (): Array<DiagnoseEntry> => {
  return diagnoses;
};

const addDiagnose = () => {
  return null;
};

export default {
  getDiagnoses,
  addDiagnose
};