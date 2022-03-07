/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import axios from "axios";

import { Diagnosis, Entry, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { addEntry, useStateValue } from "../state";
import { useParams } from "react-router-dom";
import { Header, Container, Icon, SemanticICONS, Segment } from "semantic-ui-react";
import AddEntryForm, { EntryFormValuesHealthCheck } from "../AddEntryForm";

// const HospitalEntry = ({entry, allDiagnoses}) => {
//   return (
//     <Item>
//       <Item.Content>
//         <Item.Header as='h2'>{entry.date} <Icon size='large' name='doctor'/></Item.Header>
//         <Item.Meta><i>{entry.description}</i></Item.Meta>
//         <Item.Description>
//           <ul>
//             {entry.diagnosisCodes?.map((d: string) => <li key={d}>{d} {allDiagnoses.find((a: Diagnosis) => a.code===d).name} </li>)}
//           </ul>
//         </Item.Description>
//       </Item.Content>
//     </Item>
//   );
// };


const EntryDetails: React.FC<{entry: Entry, allDiagnoses: Diagnosis[]}> = ({ entry, allDiagnoses }) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  let iconVariation: unknown;
  let heartVariation: unknown;
  let dischargeVariation: unknown;
  let employerVariation: unknown;

  const oneHollowHeart = <Icon size='tiny' name='heart outline' />;
  const oneFullHeart =  <Icon size='tiny' name='heart' />;

  switch (entry.type) {
    case "Hospital":
      iconVariation = <Icon size='large' name='hospital'/>;
      dischargeVariation = <p>Discharged on {entry.discharge.date}: {entry.discharge.criteria}</p>;
      break;
    case "HealthCheck":
      iconVariation = <Icon size='large' name='stethoscope' />;
      if (entry.healthCheckRating===3) {
        heartVariation = <>{oneHollowHeart} {oneHollowHeart} {oneHollowHeart} </>;
      }
      if (entry.healthCheckRating===2) {
        heartVariation = <>{oneFullHeart} {oneHollowHeart} {oneHollowHeart}  </>;
      }
      if (entry.healthCheckRating===1) {
        heartVariation = <>{oneFullHeart} {oneFullHeart} {oneHollowHeart} </>;
      }
      if (entry.healthCheckRating===0) {
        heartVariation = <>{oneFullHeart} {oneFullHeart} {oneFullHeart}  </>;
      }

      break;
    case "OccupationalHealthcare":
      iconVariation = <Icon size='large' name='ambulance' />;
      employerVariation = <p>employer: {entry.employerName}</p>;
      break;
    default:
      return assertNever(entry);
  }

  return (
    <Segment raised>
      <Header as='h2'>{entry.date} {iconVariation}</Header>
      <p><i>{entry.description}</i></p>
      <>{heartVariation} {dischargeVariation} {employerVariation}</>
      <ul>
        {entry.diagnosisCodes?.map((d: string) => <li key={d}> {d} {' -- '} {allDiagnoses.find((a: Diagnosis) => a.code===d).name} </li>)}
      </ul>
    </Segment>
  );

};


const SinglePatient = () => {
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const patient = Object.values(patients).find(p => p.id ===id) ;
  const entries = patient.entries? patient.entries : [];
  const allDiagnoses = Object.values(diagnoses);

 const getSinglePatient = async (id: string) => {
    try {
      const { data: singlePatient } = await axios.get<Patient>(
        `${apiBaseUrl}/patients/${id}`
      );
      dispatch({ type: "SINGLE_PATIENT", payload: singlePatient });
    } catch (e) {
      console.error(e);
    }
  };

  if (!patient.ssn) {
    void getSinglePatient(id);
  }

  let iconGender = 'genderless' as SemanticICONS;
  if (patient.gender === 'male') {
    iconGender = 'mars';
  }
  if (patient.gender === 'female') {
    iconGender = 'venus';
  }

  // const handleReset = (resetForm) => {
  //   if (window.confirm('Reset?')) {
  //     resetForm();
  //   }
  // };

  // const formik = useFormik({onreset: () =>{
  //   type: 'HealthCheck',
  //     description: '',
  //     date: '',
  //     specialist: '',
  //     diagnosisCodes: [],
  //     healthCheckRating: HealthCheckRating.Healthy
  // }});

  const submitNewEntry = async (values: EntryFormValuesHealthCheck, {resetForm} ) => {
    console.log('submitted new entry');
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const {data: updatedPatient} = await axios.post(`${apiBaseUrl}/patients/${id}/entries`, values);
      console.log(updatedPatient);
      dispatch(addEntry(updatedPatient));
      resetForm({});
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
      if(axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        errorMessage = error.response.data.error;
      }
      //setError(errorMessage);
      console.log(errorMessage);
    }
  };

  const onCancel = () => {
    console.log('canceled entry');

  };
  
  return (
    <div>
      <Header as='h2'>{patient.name} <Icon name={iconGender} /> </Header> 
      <Container fluid>
        <p>ssn: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
      </Container>
      <Header>entries</Header>
      <Container>
      {/* <Item.Group></Item.Group> */}
        {entries.map((e:Entry) => {
          return (
            <div key={e.id}>
              <EntryDetails entry={e} allDiagnoses={allDiagnoses} />
              {/* <p>{e.date} {e.description}</p>
              <ul>
                {e.diagnosisCodes?.map(d => <li key={d}>{d} {allDiagnoses.find(a => a.code===d).name} </li>)}
              </ul> */}
            </div>
          );
        })}
      </Container>
      <Header as='h3'>Health Check new entry: </Header>
      <AddEntryForm onSubmit={submitNewEntry} onCancel={onCancel} />
    </div>
  );
};

export default SinglePatient;
