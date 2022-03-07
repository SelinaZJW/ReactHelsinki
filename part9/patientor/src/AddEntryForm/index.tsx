import { Field, Form, Formik } from 'formik';
import React from 'react';
import { Button, Grid } from 'semantic-ui-react';
import { DiagnosisSelection, NumberField, SelectTypeField, TextField, TypeOptions } from '../AddPatientModal/FormField';
import { useStateValue } from '../state';
import { HealthCheckEntry, NewEntry } from '../types';

export type EntryFormValuesHealthCheck = Omit<HealthCheckEntry, 'id'>;

interface Props {
  onSubmit: (values: NewEntry, {resetForm}) => void;
  onCancel: () => void;
}

const TypeVariations: React.FC<{type: string}> = ({ type }) => {
  let variation: JSX.Element;
  
  switch (type) {
    case "Hospital":
      variation = 
      <Grid>
        <Grid.Column floated="left" width={8}>
          <Field
            label="Discharge  Date"
            placeholder="YYYY-MM-DD"
            name="discharge.date"
            component={TextField}
            />
        </Grid.Column>
        <Grid.Column floated="right" width={8}>
          <Field
            label="Discharge Criteria"
            placeholder="criteria"
            name="discharge.criteria"
            component={TextField}
            />
        </Grid.Column>
      </Grid>;
      break;
    case "HealthCheck":
      variation = 
      <Field
      label="healthCheckRating"
      name="healthCheckRating"
      component={NumberField}
      min={0}
      max={3}
      />;
      break;
    case "OccupationalHealthcare":
      variation = 
      <>
        <Field
          label="Employer"
          placeholder="Employer Name"
          name="employerName"
          component={TextField}
          />
        
        <Grid>
            <Grid.Column floated="left" width={8}>
              <Field
                label="Sickleave Start Date"
                placeholder="YYYY-MM-DD"
                name="sickLeave.startDate"
                component={TextField}
                />
            </Grid.Column>
            <Grid.Column floated="right" width={8}>
              <Field
                label="Sickleave End Date"
                placeholder="YYYY-MM-DD"
                name="sickLeave.endDate"
                component={TextField}
                />
            </Grid.Column>
          </Grid>
      </>;
      break;
    case "Select Type":
      variation = null;
      break;
    default:
      return null;
  }

  return <>{variation}</>;
  // value changing from undefined to defined?? can't POST value 
};

const typeOptions: TypeOptions[] = [
  { value: "Hospital", label: "Hospital" },
  { value: "HealthCheck", label: "HealthCheck" },
  { value: "OccupationalHealthcare", label: "OccupationalHealthcare" }
];

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();
  // const [type, setType] = useState('Hospital');

  return (
    <Formik
    initialValues={{
      type: 'Hospital',
      description: '',
      date: '',
      specialist: '',
      diagnosisCodes: [],
      discharge: {date: '', criteria: ''},
      healthCheckRating: 0,
      sickLeave: {startDate: '', endDate: ''},
      employerName: ''

      //need to specific/define all the initial values, to send the values
    }}
    onSubmit={onSubmit}
    // validate={values => {
    //   /// ...
    // }}
  >

    {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {

      return (
        <div>
  
        <Form className="form ui">
          <SelectTypeField 
            name="type"
            label='Type'
            options={typeOptions}
            // onChange={(e)=> setType(e.target.value)}
          />
          {/* why is this not changing with selection?
          how to POST type with other values */}
          <Field
            label="Description"
            placeholder="Description"
            name="description"
            component={TextField}
            />
          <Field
            label="Date"
            placeholder="YYYY-MM-DD"
            name="date"
            component={TextField}
            />
          <Field
            label="Specialist"
            placeholder="Specialist"
            name="specialist"
            component={TextField}
            />
          <DiagnosisSelection
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            diagnoses={Object.values(diagnoses)}
          />

          {/* <Field
            label="healthCheckRating"
            name="healthCheckRating"
            component={NumberField}
            min={0}
            max={3}
            /> */}
          <TypeVariations type={values.type}/>

          <Grid>
            <Grid.Column floated="left" width={5}>
              <Button type="reset" onClick={onCancel} color="red">
                Cancel
              </Button>
            </Grid.Column>
            <Grid.Column floated="right" width={5}>
              <Button
                type="submit"
                floated="right"
                color="green"
                disabled={!dirty || !isValid}
                >
                Add
              </Button>
            </Grid.Column>
          </Grid>
        </Form>
        </div>
      );
    }}

  </Formik>
  );

};

export default AddEntryForm;