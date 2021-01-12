const {google} = require('googleapis');

const getRange = (Alpha, positionId) => {
    const number = Number(positionId) + 1;
    return (Alpha+number)
}

module.exports = async (array, spreadsheetId, authClient) => {
//  async function batchUpdateSheet (authClient) {
    const sheets = google.sheets({version: 'v4', authClient});
    // const jsonString = await readFile('newGeoCodeArray.json', "utf8")
    // // console.log(jsonString)
    // array = JSON.parse(jsonString)
    batchResourceObject = {
        "data": [],
        "includeValuesInResponse": false,
        "responseValueRenderOption": "FORMATTED_VALUE",
        "responseDateTimeRenderOption": "FORMATTED_STRING",
        "valueInputOption": "RAW",
      }
    array.forEach(element => {
        if(!element['Latitude, Longitude'] && element.Address){
        const dataObject = {
            "majorDimension": "DIMENSION_UNSPECIFIED",
            "range": getRange("E",element.positionId),
            "values": [
              [
                element['Latitude, Longitude']
              ]
            ]
          }
          batchResourceObject.data.push(dataObject)}
    });
    console.log(batchResourceObject.data.length,'<-----------------batchResourceObject.data.length')
    if(batchResourceObject.data.length){
        try {
            console.log('Inside')
            const response = await sheets.spreadsheets.values.batchUpdate({
                // The ID of the spreadsheet to update.
                spreadsheetId: spreadsheetId,  // TODO: Update placeholder value.
            
                resource: batchResourceObject,
            
                auth: authClient,
              });
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }


}

