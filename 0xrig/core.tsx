const fs = require("fs");
const os = require("os");
const path = require("path");
const envFilePath = path.resolve(__dirname, "../.env");

exports.PORT = function() {
    return getEnvValue('PORT')
}

exports.isJSON = function(str){
  try {
    JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

const processRigRequest = (endpoint, data)=>{
  if(endpoint === `ping`){
    // Find ENV file.
    // Private Key. Is this needed?
    // Phone Profile (LENS is gone).
    // LivePeer API. (Move to LocalStorage)
    return {
      version: getEnvValue('VERSION'),
      theme: getEnvValue('THEME'),
      latest: getEnvValue('LATEST_VERSION'),
      ready: !0,
      status: {
        class:"success",
        text:"Server Online"
      },
      progress: "1/5",
      wallet: {
        address:"0x00"
      },
      balance: {
        total:0,
        token:"MATIC"
      },
      steps: [
        {title:"0xCore Server",text:"Online | Server running", status:1, icon:'server'} ,
        {title:".env File",text:"Not Found", status:0, icon:'file'} ,
        {title:"Private Key",text:"Not Found", status:0, icon:'shield'} ,
        {title:"Phone Profile",text:"Not Found", status:0, icon:'rig'} ,
        {title:"LivePeer API",text:"Not Found", status:0, icon:'net'} 
      ]
    }
  }
  return data
}

// read .env file & convert to array
const readEnvVars = () => fs.readFileSync(envFilePath, "utf-8").split(os.EOL)
/**
 * Finds the key in .env files and returns the corresponding value
 *
 * @param {string} key Key to find
 * @returns {string|null} Value of the key
 */
const getEnvValue = (key) => {
  // find the line that contains the key (exact match)
  const matchedLine = readEnvVars().find((line) => line.split("=")[0] === key);
  // split the line (delimiter is '=') and return the item at index 2
  return matchedLine !== undefined ? matchedLine.split("=")[1] : null;
};

/**
 * Updates value for existing key or creates a new key=value line
 *
 * This function is a modified version of https://stackoverflow.com/a/65001580/3153583
 *
 * @param {string} key Key to update/insert
 * @param {string} value Value to update/insert
 */
const setEnvValue = (key, value) => {
  const envVars = readEnvVars();
  const targetLine = envVars.find((line) => line.split("=")[0] === key);
  if (targetLine !== undefined) {
    // update existing line
    const targetLineIndex = envVars.indexOf(targetLine);
    // replace the key/value with the new value
    envVars.splice(targetLineIndex, 1, `${key}=${value}`);
  } else {
    // create new key value
    envVars.push(`${key}=${value}`);
  }
  // write everything back to the file system
  fs.writeFileSync(envFilePath, envVars.join(os.EOL));
};

exports.rigRequest = (req)=>{
  var error = false
  var data = req.query
  var endpoint = req.params.endpoint
  data = processRigRequest(endpoint, data)
    // Process ENDPOINT and update (data) and (error)
    return (req.query.callback !== undefined && req.query.callback !== 'undefined') ? `${req.query.callback}(${JSON.stringify({
      method: "GET",
      callback: req.query.callback,
      data,
      endpoint,
      error,
      userAgent: req.headers["user-agent"]
    })})` : {
      method: "GET",
      data,
      endpoint,
      error,
      userAgent: req.headers["user-agent"]
    } ;
  }

exports.apiRequest = (req)=>{
var error = false
var data = req.query
var endpoint = req.params.endpoint
  // Process ENDPOINT and update (data) and (error)
  return (req.query.callback !== undefined && req.query.callback !== 'undefined') ? `${req.query.callback}(${JSON.stringify({
    method: "GET",
    callback: req.query.callback,
    data,
    endpoint,
    error,
    userAgent: req.headers["user-agent"]
  })})` : {
    method: "GET",
    data,
    endpoint,
    error,
    userAgent: req.headers["user-agent"]
  } ;
}

exports.defaultRequest = (req)=>{
  return (req.query.callback !== undefined && req.query.callback !== 'undefined') ? `${req.query.callback}(${JSON.stringify({
    method: "GET",
    callback: req.query.callback,
    data: req.query,
    message: 'This is not an authorized endpoint. Call /api/',
    userAgent: req.headers["user-agent"]
  })})` : {
    method: "GET",
    data: req.query,
    message: 'This is not an authorized endpoint. Call /api/',
    userAgent: req.headers["user-agent"]
  } ;
}