const fs  = require('fs');
const axios = require('axios')
var _get = require('lodash.get');
const GEOCODING_API = process.env.GEOCODING_API
const convertLatLngObjectToString = (latlngObj) => {
    if(latlngObj)
        return `${latlngObj.lat},${latlngObj.lng}`
    else return ``
}

module.exports  = async (content) => {
    // const contentArray = [(content)[0]];
    const contentArray = (content);
    const newGeoCodeArray = []
    let index = 0;
    while(index < contentArray.length){
        let element = contentArray[index];
        if(element.Address && !element['Latitude, Longitude']){
            const address = `${element.Address.trim()}, ${element['Zip Code']}, ${element.City}, ${element.State}`
            const addressURI= address.replace(/ /g,"+")
            // console.log(addressURI)
            const result = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${addressURI}&key=${GEOCODING_API}`)
            const latlngObj = _get(result,'data.results[0].geometry.location',null)
            // console.log(latlngObj)
            element['Latitude, Longitude'] = convertLatLngObjectToString(latlngObj)
        }
        element.positionId = index+1;
        newGeoCodeArray.push(element)
        index++;
    }
    fs.writeFileSync("geodata.js", `window.geodata=${JSON.stringify(newGeoCodeArray)}`); 
    return newGeoCodeArray
}