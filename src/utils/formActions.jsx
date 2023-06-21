import configData from "../config.json";
import keyBy from "lodash/keyBy";
import { fetchKeywords, fetchStage } from "./ruleActions"

const portRange = "^((any)|([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])(?::([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?)$"

function createDynamicSchema(text, optionName, optionsData, useTitle, index, uiSchema) {
    if (index) {
        optionName += `${index}`
    }
    switch (text) {
        case "string":
            if (!useTitle) {
                uiSchema.options.items[`${optionName}`] = {
                    "ui:label": false,
                }
            }
            return [optionName, { title: useTitle, type: "string" }]
        case "int":
            if (!useTitle) {
                uiSchema.options.items[`${optionName}`] = {
                    "ui:label": false,
                }
            }
            return [optionName, { title: useTitle, type: "integer" }]
        case "[!]":
            uiSchema.options.items[`${optionName}`] = {
                "ui:label": true,
                "ui:widget": "select"
            }
            return [optionName, {
                "type": "boolean",
                "default": false,
                title: "exclude:",
                "oneOf": [
                    {
                        "title": "!",
                        "const": true
                    }, {
                        "title": " ",
                        "const": false
                    },
                ]
            }]
        default:
            if ((text.startsWith("{?")) && (text.endsWith("}"))) {
                return [text.substring(2, text.length - 1), { type: "boolean" }]
            }
            else if (text.includes("_modifer")) {
                const filterdOptionsData = optionsData.filter((op) => op.fields.stage === text)
                const mapedOptionsData = filterdOptionsData.map((op) => createDynamicSchema(op.fields.options, op.fields.name, optionsData, op.fields.name))
                const properiesOptionsData = Object.fromEntries(mapedOptionsData)
                return [text, { properties: properiesOptionsData }]
            }//eslint-disable-next-line
            else if (text == "None") {
                return [optionName, { type: "boolean" }]
            }
            else if ((text.startsWith("{")) && (text.endsWith("}"))) {
                uiSchema.options.items[`${optionName}`] = {
                    "ui:label": false,
                    "ui:widget": "select"
                }
                return [optionName, { title: useTitle, type: "string", enum: text.substring(1, text.length - 1).split("|") }]
            }

            return [optionName, { type: "string" }]
    }
}
const setoption = (option, optionsData, uiSchema) => {
    if (optionsData && optionsData.length > 0) {
        //eslint-disable-next-line
        const splited = keyBy(optionsData, "fields.name")[option].fields.options.split(/[,]+/)
        const trimed = splited.map((text) => text.trim())
        const filterd = trimed.filter((str) => str !== null && str.match(/^ *$/) === null)
        const listOflw = filterd.map((text, index) => createDynamicSchema(text, keyBy(optionsData, "fields.name")[option].fields.name, optionsData, "", index, uiSchema))
        const newdata = Object.fromEntries(listOflw)
        newdata["option"] = { enum: [option] }
        return { properties: newdata }
    }
    // todo: get correct option data , create the object schema
    return {
        properties: {
            option: {
                enum: [
                    option
                ]
            },
            "testing dynamic function": {
                "type": "boolean"
            }
        }
    }
}

const data = await fetchKeywords();
const actions = data[0].error ? ["error"] :fetchStage(data, "action", "fields.name")
const protocols = data[0].error ? ["error"] :fetchStage(data, "protocol", "fields.name")
const services = data[0].error ? ["error"] :fetchStage(data, "service", "fields.name")
const options = data[0].error ? [] :fetchStage(data, "options", "fields.name")

export const optionsData = data
export const uiSchema = configData.uiSchema; 
const keword_options = options.map((op) => setoption(op, data, uiSchema))
export const theSchema = configData.schema
theSchema.definitions.actions.enum = actions
theSchema.definitions.protocols.enum = protocols.concat(services)
theSchema.definitions.services.enum = services
theSchema.definitions.options.properties.option.enum = options
theSchema.definitions.options.dependencies.option.oneOf = keword_options
theSchema.properties.src_port.pattern = portRange
theSchema.properties.dst_port.pattern = portRange
export const initFormData = {
    "options": [{ "option": "content", "content": false },
    { option: 'tag', tag: 'session', tag_modifer: { packets: 10 } }]
  }
