var statusString = {  
    0 : 'failed' , 
    1 : 'success' 
};
const CryptoJS = require("crypto-js");
const _apiKey = 'nsyvhfwotx';


/**
 * -------------------------------------------------------------------
 * Start : Helper Functions to modify the reponse
 * -------------------------------------------------------------------
 */

const send = ( res , data = [] , message = 'Success' ) => {
    //let data = _encrypt(resdata);
    response = {status : statusString[1],data,message};
    return res.send(response);
}

const error = ( res , message = 'Something went wrong, please try after some time' , data = {} ) => {
    //let data = _encrypt(data);
    response = {status : statusString[0],data,message};
    return res.send(response);
}

const vfaild = (res , response) => {
    return res.status(400).send(response);
}

const statusError = ( res , status = 400 , message = 'Something went wrong, please try after some time' ) => {
    response = {status , data : [] ,message};
    return res.status(status).send(response);
}

/**
 * -------------------------------------------------------------------
 * End : Helper Functions to modify the reponse
 * -------------------------------------------------------------------
 */

const _encrypt = (data) => {
    console.log(_apiKey);
    return CryptoJS.AES.encrypt(JSON.stringify(data), _apiKey).toString();
}

const _decrypt = (data) => {
    return JSON.parse(CryptoJS.AES.decrypt(data, _apiKey).toString(utf8));
}

module.exports = { send , error , statusError , vfaild };