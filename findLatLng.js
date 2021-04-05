
const core = require("@actions/core");
function formatDate(dateString){
  let dateValue = '';
  if(dateString){
    const dateArray = dateString.split('/');
    dateArray[0] = dateArray[0].length === 1?('0'+dateArray[0]):dateArray[0]
    dateArray[1] = dateArray[1].length === 1?('0'+dateArray[1]):dateArray[1]
    dateValue =  `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`
  }
  return dateValue
}
module.exports = async (content) => {
  // const contentArray = [(content)[0]];
  const contentArray = content;
  let newGeoCodeArray = []
  try {
    newGeoCodeArray = contentArray.filter((element,index) => {
      
      const condition1 = element.Display === 'Y'
      const condition2 = Number(element['Number of Locations'])
      if(condition1 && condition2){
        return element
      }
      }).map((element,index) => {
        element.positionId = index + 1;
        delete element['Email Address']
        delete element['Timestamp']
        delete element['Edit Link']
        delete element['File upload for Source']
        element['Start Date'] = formatDate(element['Start Date'])
        element['End Date'] =formatDate(element['End Date'])
        return element
      })
  } catch (error) {
    core.info(error)
    throw error
  }
  return newGeoCodeArray;
};
