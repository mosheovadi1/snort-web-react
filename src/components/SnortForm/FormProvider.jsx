import React, { useState, useMemo, createContext, useEffect } from "react";
//import css from "./SearchPage.module.css";
import { optionsData, initFormData } from "../../utils/formActions";
import { get_current_rule, updateKW } from "../../utils/ruleActions";
const FormContext = createContext();

const FormProvider = ({ children }) => {
    const [content, setContent] = useState("")
    const [error, setError] = useState("")
    const [, setfirstLoad] = useState(true)
    const [isFocused, setIsFocused] = useState(false);
    const [formData, setFormData] = useState(initFormData)
    
    const location = window.location

    const setFormFields = setFormData
    const setFormContent = setContent
    
    useEffect(()=>{
        const getFirstData = async()=>{ 
            const current_rule = await get_current_rule(location.pathname)
            if (current_rule){
                setContent(current_rule)
                updateKW(current_rule, setError, setFormFields)
            }
        }
        setfirstLoad((prevState) => {
            if (prevState){
                getFirstData()
            }
            return false
        })
    }, [location.pathname, setFormFields])
    
    if (optionsData && optionsData[0].error) {
        setError(optionsData[0].error)
    }
    const functions = useMemo(
        () => ({
            setFormContent,
            setError,
            setIsFocused,
            setFormFields
        }),
        [setFormContent, setError, setIsFocused, setFormFields]
    );
    const dataVars = useMemo(
        () => ({
            content,
            error,
            isFocused,
            formData
        }),
        [content, error, isFocused, formData]
    );
    const value = { ...functions, ...dataVars }
    return (
        //css["search-form"]
        <FormContext.Provider value={value} >{children}</FormContext.Provider>
    );
};

export { FormProvider, FormContext };