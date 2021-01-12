const fs  = require('fs');
const axios = require('axios')
var _get = require('lodash.get');

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
            const result = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${addressURI}&key=AIzaSyAZrTp6Gtg0savyY6KhaT-ibWIE-0WeXXc`)
            const latlngObj = _get(result,'data.results[0].geometry.location',null)
            // console.log(latlngObj)
            element['Latitude, Longitude'] = convertLatLngObjectToString(latlngObj)
        }
        element.positionId = index+1;
        newGeoCodeArray.push(element)
        index++;
    }
    fs.writeFileSync("geodata.json", JSON.stringify(newGeoCodeArray)); 
    return newGeoCodeArray
}