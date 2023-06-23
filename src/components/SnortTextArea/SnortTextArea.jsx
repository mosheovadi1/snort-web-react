import React, { useRef, useContext } from 'react';
import { updateKW } from "../../utils/ruleActions";
import { FormContext } from "../FormProvider/FormProvider";

const TextArea = () => {
    const { setFormContent, setError, setIsFocused, setFormFields, content, error, isFocused } = useContext(FormContext);
    const searchInput = useRef(null)


    const onchange = (event) => {
        if (isFocused) { updateKW(event.target.value, setError, setFormFields) }
        setFormContent(event.target.value)
    }
    return <>
        <textarea ref={searchInput} style={{"display":"flex"}} type="textarea" name="content" cols="40" rows="10" className="vLargeTextField" maxLength="2048" required="" id="id_content"
            onChange={onchange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={content} />
        <label style={{ color: "red" , maxWidth: "fit-content"}}  title="error">{error}</label>
    </>
}

export default TextArea;