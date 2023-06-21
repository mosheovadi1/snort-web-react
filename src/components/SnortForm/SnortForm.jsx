import { updateRule } from "../../utils/ruleActions";
import css from "./SnortForm.module.css";
import { optionsData, theSchema, uiSchema } from "../../utils/formActions";
import Form from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import React, { useEffect, useContext } from 'react';
import { FormContext } from "./FormProvider";


const SnortForm = () => {
  const { setError, setFormContent, setFormFields, isFocused, formData } = useContext(FormContext);
  const updateForm = (formdata) => {
    setFormFields(formdata.formData)
    if (!isFocused) { updateRule(formdata, setError, setFormContent) }
  }
  const log = (type) => console.log.bind(console, type);
  useEffect(() => {
    if (optionsData && optionsData[0].error) {
      setError()
    }
  }, [setError])
  return (!([optionsData].some((arr) => arr.length === 0))) ? (<Form
    className={css["react-jsonschema-form"]}
      uiSchema={uiSchema}
      schema={theSchema}
      validator={validator}
      formData={formData}
      onChange={updateForm}
      onSubmit={log('submitted')}
      onError={log('errors')}
      liveValidate
      focusOnFirstError={true}
    ><button style={{ display: "none" }} type="submit">dfg</button>
    </Form>) : (<></>)
  
}

export default SnortForm;
