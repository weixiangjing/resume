
import axios from "axios";

export function getLicense (body){
   return  axios.post("serviceLicense/get",body)
}

export function alterLicense(body){
    return axios.post("serviceLicense/update",body);
}

export function addLicense (body){
    return axios.post("serviceLicense/add",body);
}

export function getLicenseLog(body){
    return axios.post("serviceLicenseOperLog/get",body);
}
export function getLicenseRecords(body){
    return axios.post("serviceLicenseUsedLog/get",body);
}