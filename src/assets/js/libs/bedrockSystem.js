import { format } from "./formatter"

class BedrockSystem {
    constructor() { }
    log(...data) {
        const dataFormat = []
        data.forEach(element => {
            if (isJSON(element)) {
                dataFormat.push(format(element))
            } else {
                dataFormat.push(element)
            }
        });
        console.warn(...dataFormat)
    }

    warn(...data) {
        const dataFormat = []
        data.forEach(element => {
            if (isJSON(element)) {
                dataFormat.push(format(element, { type: 'r§6' }))
            } else {
                dataFormat.push(`§6${element}`)
            }
        });
        console.warn(...dataFormat)
    }

    error(...data) {
        const dataFormat = []
        data.forEach(element => {
            if (isJSON(element)) {
                dataFormat.push(format(element, { type: 'r§4' }))
            } else {
                dataFormat.push(`§4${element}`)
            }
        });
        console.warn(...dataFormat)
    }
}


const isJSON = (output) => {
    return (typeof (output) != "string");
}

export const shell = new BedrockSystem();