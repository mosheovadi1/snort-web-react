import configData from "../config.json";
import get from "lodash/get";

export const updateRule = async (currData, setError, setFormContent) => {
    //eslint-disable-next-line
    const response = await fetch(configData.baseUrl + "/build_rule_serialize/", { body: JSON.stringify(currData.formData), method: "post", "Content-Type": "application/json" }).catch(setError);
    const contentType = response.headers.get("content-type");
    let data = "";
    if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
    }
    else {
        setError("illegal form data, please fix");
    }
    if (data) {
        console.log(data)
        setFormContent(data["content"]);
    }
};

export const updateKW = async (currData, setError, setFormFields) => {
    const response = await fetch(configData.baseUrl + "/build_rule_parse/", { body: currData, method: "post", "Content-Type": "application/text" }).catch(setError)
    const contentType = response.headers.get("content-type");
    let result = null
    if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json()
        if (result) {
            setError("")
            setFormFields(result)
        }
    }
    else {
        setError("illegal syntex, please fix or build form with builder ")
    }
    return result;
}

export const get_current_rule = async (path) => {
    if (path === undefined || !path.includes("snortrule")) {
        return ""
    }
    const rule_id = path.split("/snortrule/")[1].split("/")[0]

    const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    const getruleurl = configData.baseUrl + `/get_rule_update/${rule_id}`
    const response = await fetch(`${getruleurl}/`, {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        }
    })
    const data = await response.text()
    return data
}

export const fetchKeywords = async () => {
    const url = configData.baseUrl + "/get"
    const response = await fetch(`${url}/`).catch((e) => { console.log(e) })
    if (response) {
        const data = await response.json()
        return data
    }
    else {
        return [{ "error": "ERROR cannot retrive data from server" }]
    }
}

export const fetchStage = (data, stage, filedPath) => {
    return data.filter((o) => (o.fields.stage === stage)).map((o) => get(o, filedPath))
}


const getPcaps = () => ["test"]//[...document.getElementById("id_pcap_sanity_check_to").options].map(o => o.text)

export const checkPcaps = (content, setResult, setLoaded) => {
    const myBody = JSON.stringify({ "pcaps": getPcaps(), "rule": content })
    const url = configData.baseUrl + "/check_pcap/";
    fetch(url, { body: myBody, method: "post", "Content-Type": "application/json", 'Accept': 'application/json' }).then((response) => {
        response.json().then(
            (data) => {
                setResult(data);
                setLoaded()
            }
        )
    }).catch((e) => { console.log(e) });

}