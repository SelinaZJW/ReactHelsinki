import { State } from "./state";
import { Diagnosis, Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "SINGLE_PATIENT";
      payload: Patient;
    }
  |  {
      type: "GET_DIAGNOSES";
      payload: Diagnosis[];
    }
  | {
      type: "ADD_ENTRY";
      payload: Patient;
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "GET_DIAGNOSES":
      return {
        ...state, 
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses
        }, 
        patients: {
          ...state.patients
        }
      };
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }, 
        diagnoses: {
          ...state.diagnoses
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }, 
        diagnoses: {
          ...state.diagnoses
        }
      };
    case "SINGLE_PATIENT":
      const id = action.payload.id;
      const existingPatient = Object.values(state.patients).find(p => p.id ===id);
      console.log(existingPatient);
      const updatedPatients = {...state.patients, [id]: action.payload };  //updating the object
      
// if (existingPatient.ssn) {
//         return {...state};
//       } else {
//         return {
//         ...state,
//         patients: {
//           // existingPatient: action.payload, //not adding, but updating
//           // ...state.patients,
//           ...updatedPatients
//         },
//         diagnoses: {
//           ...state.diagnoses
//         }
//       };
//     }
      return {
        ...state,
        patients: {
          // existingPatient: action.payload, //not adding, but updating
          // ...state.patients,
          ...updatedPatients
        },
        diagnoses: {
          ...state.diagnoses
        }
      };
    case "ADD_ENTRY": 
      const changedId = action.payload.id;
      const originalPatient = Object.values(state.patients).find(p => p.id ===changedId);
      console.log(originalPatient);
      const updatedWholePatients = {...state.patients, [changedId]: action.payload };  //updating the object

      return {
        ...state,
        patients: {
          ...updatedWholePatients
        },
        diagnoses: {
          ...state.diagnoses
        }
      };

    default:
      return state;
  }
};

export const setPatientList = (patients: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload: patients
  };
};

export const addPatient = (patient: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload: patient
  };
};

export const singlePatient = (patient: Patient): Action => {
  return {
    type: "SINGLE_PATIENT",
    payload: patient
  };
};

export const getDiagnoses = (diagnoses: Diagnosis[]): Action => {
  return {
    type: "GET_DIAGNOSES",
    payload: diagnoses
  };
};

export const addEntry = (updatedPatient: Patient): Action => {
  return {
    type: "ADD_ENTRY",
    payload: updatedPatient
  };
};