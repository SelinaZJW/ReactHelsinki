import { Field, Form, Formik } from 'formik';
import React from 'react';
import { Button, Grid } from 'semantic-ui-react';
import { DiagnosisSelection, NumberField, TextField } from '../AddPatientModal/FormField';
import { useStateValue } from '../state';
import { HealthCheckEntry, HealthCheckRating } from '../types';

export type EntryFormValuesHealthCheck = Omit<HealthCheckEntry, 'id'>;

interface Props {
  onSubmit: (values: EntryFormValuesHealthCheck, {resetForm}) => void;
  onCancel: () => void;
}

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
    initialValues={{
      type: 'HealthCheck',
      description: '',
      date: '',
      specialist: '',
      diagnosisCodes: [],
      healthCheckRating: HealthCheckRating.Healthy
    }}
    onSubmit={onSubmit}
    // validate={values => {
    //   /// ...
    // }}
  >

    {({ isValid, dirty, setFieldValue, setFieldTouched }) => {

      return (
        <Form className="form ui">
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
          <Field
            label="healthCheckRating"
            name="healthCheckRating"
            component={NumberField}
            min={0}
            max={3}
            />

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
      );
    }}

  </Formik>
  );

};

export default AddEntryForm;