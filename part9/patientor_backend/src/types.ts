export interface DiagnoseEntry {
  code: string;
  name: string;
  latin?: string
}

//export type Gender = 'male' | 'female' | 'other';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

// interface BaseEntry {
//   id: string;
//   description: string;
//   date: string;
//   specialist: string;
//   diagnosisCodes?: Array<DiagnoseEntry['code']>
// }

// export enum HealthCheckRating {
//   "Healthy" = 0,
//   "LowRisk" = 1,
//   "HighRisk" = 2,
//   "CriticalRisk" = 3
// }

// interface HealthCheckEntry extends BaseEntry {
//   type: "HealthCheck";
//   healthCheckRating: HealthCheckRating;
// }

// interface HospitalEntry extends BaseEntry {
//   type: "Hospital";
//   discharge: {date: string, criteria: string }
// }


// interface OccupationalHealthcareEntry extends BaseEntry {
//   type: "OccupationalHealthcare";
//   employerName: string;
//   sickLeave?: {startDate: string, endDate: string}
// }

// export type Entry =
//   | OccupationalHealthcareEntry
//   | HospitalEntry
//   | HealthCheckEntry;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Entry = {
};

export interface PatientEntry  {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[]
}


export type PublicPatientEntry = Omit<PatientEntry, 'ssn' | 'entries'>;

export type NewPatientEntry = Omit<PatientEntry, 'id'>;