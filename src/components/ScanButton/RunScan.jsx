import React, { useContext, useState } from 'react';
import { FormContext } from "../FormProvider/FormProvider";
import { checkPcaps } from "../../utils/ruleActions";
import snortImg from "../assets/img/snortImg.jpg"
import clean from "../assets/img/clean.jpeg"
import Loader from "../Loader/Loader"


const RunScan = () => {
    const { content } = useContext(FormContext);
    const [isLoading, setIsLoading] = useState(false);
    const [popUpData, setPopUpData] = useState("");
    const setResults = (data) => { setPopUpData(data) }
    const setLoaded = () => { setIsLoading(false) }

    const clickTrigger = () => {
        setIsLoading(true);
        checkPcaps(content, setResults, setLoaded)
    };
    const cleanTrigger = () => {
        setIsLoading(false);
        setPopUpData("")
    };
    let returnData = []
    let errData = []
    if (popUpData) {
        returnData = popUpData.stdout
        errData = popUpData.stderr
    }
    return <>
        <img alt="scan" style={{ "width": "50px" }} src={snortImg} onClick={clickTrigger}></img>
        <img alt="clean" style={{ "width": "50px" }} src={clean} onClick={cleanTrigger}></img>
        <Loader isLoading={isLoading}>
         {returnData.map((item) => {
                console.log(item)
                return item.split(/\n/).map(
                    (s) => {
                        console.log(s)
                        return < span > {s}<br></br></span>
                    }
                )
            }

            )
            }
            <br />
            {errData.map((item) => (item.split(/\n/).map((s => <span>{s}<br></br></span>))))}
        </Loader>
    </>
}
export default RunScan;