

function convertLatLngStringToObj(LatLngString) {
  const array = LatLngString.split(',');
  return {
    lat: Number(array[0]),lng:Number(array[1])
  }
}
const tableDict = {
  "Employer": {
    "name": "Employer",
    "type": "string"
  },
  "Union": {
    "name": "Union",
    "type": "string"
  },
  "Union Local": {
    "name": "Union_Local",
    "type": "string"
  },
  "Bargaining Unit Size": {
    "name": "Bargaining_Unit_Size",
    "type": "string"
  },
  "Latitude, Longitude": {
    "name": "Latitude,_Longitude",
    "type": "string"
  },
  "Address": {
    "name": "Address",
    "type": "string"
  },
  "City": {
    "name": "City",
    "type": "string"
  },
  "State": {
    "name": "State",
    "type": "string"
  },
  "Zip Code": {
    "name": "Zip_Code",
    "type": "string"
  },
  "Strike or lockout?": {
    "name": "Strike_or_lockout?",
    "type": "string"
  },
  "approx # Ees on stoppage": {
    "name": "approx_#_Ees_on_stoppage",
    "type": "string"
  },
  "Start Date": {
    "name": "Start_Date",
    "type": "date"
  },
  "End Date": {
    "name": "End_Date",
    "type": "date"
  },
  "Duration": {
    "name": "Duration",
    "type": "string"
  },
  "Authorized?": {
    "name": "Authorized?",
    "type": "string"
  },
  "Threat?": {
    "name": "Threat?",
    "type": "string"
  },
  "Issues": {
    "name": "Issues",
    "type": "string"
  },
  "Source": {
    "name": "Source",
    "type": "string"
  },
  "positionId": {
    "name": "positionId",
    "type": "string"
  }
}
window.addEventListener('load',()=> {
  console.log(window)
  const fromDate = document.getElementById('fromDate') 
  const endDate = document.getElementById('endDate') 
  const filterButton = document.getElementById('filterButton') 
  filterButton.onclick  = (event) => {
    console.log(fromDate.value,'<-----------------fromDate.value')
    console.log(endDate.value,'<-----------------endDate.value')
  }
  let createTableColStringAndType = ''
  let createTableColString = ''
  const tableDictArray = Object.keys(tableDict);
  const tableDictArrayLength = tableDictArray.length
  tableDictArray.forEach((key, index) => {
    createTableColString += `${tableDict[key].name} `
    createTableColStringAndType += `${tableDict[key].name} ${tableDict[key].type}`
    if(index !== tableDictArrayLength-1){
      createTableColString += `, `
      createTableColStringAndType+= ', '
    }
  })
  let valuesString = '';
  // alasql(`CREATE TABLE geodata (${createTableColStringAndType},  PRIMARY KEY (positionId))`);
  window.geodata.forEach((obj) => {
    // valuesString += `(${})`
    let singleValueString = '(';
    tableDictArray.forEach((key, index) => {
      singleValueString += `${obj[key]}, `
      if(index !== tableDictArrayLength-1){
        singleValueString += `),`
      }
    })
    valuesString += singleValueString
  })
  // console.log(valuesString)
})



// Initialize and add the map
function initMap() {
  const geodata = window.geodata
  let infowindow = null
  let currWindow =false; 
  const listDiv = document.getElementById('list-box');
  function createInfoWindow(strike, marker){
    if(infowindow){
      infowindow.close();
    }
    infowindow = new google.maps.InfoWindow({
      content: createContentString(strike),
    });
    infowindow.open(map, marker);
  }
  function createCard(strike, marker){
    const card = document.createElement('div');
    card.setAttribute("class", "card");
    const cardBody = document.createElement('div');
    cardBody.setAttribute("class", "card-body");
    cardBody.innerHTML = `${strike.Employer} - ${strike.Union}`;
    card.append(cardBody);
    card.addEventListener('click',() => {
      createInfoWindow(strike,marker)
    })
    return card
  }
  function createContentString(strike) {
    let htmlString = ''
    Object.keys(strike).forEach((keyName) => {
      if(strike[keyName]){
        htmlString += `<strong>${keyName}</strong> : ${strike[keyName]} </br>`
      }
     
  })
  return htmlString
  }
  // The location of Uluru
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
      zoom:4.3,
      center: { lat: 39.9492309, lng: -76.7440666 }
  });
  const markerArray = []
  // The marker, positioned at Uluru
  geodata.forEach((strike,index) => {

    if(strike['Latitude, Longitude']){
      const strikePosition = convertLatLngStringToObj(strike['Latitude, Longitude'])
      const marker = new google.maps.Marker({
        position: strikePosition,
        map: map,
        title: strike.City
      });
      markerArray.push(marker)
      const card = createCard(strike, marker)
      listDiv.append(card);
        marker.addListener("click", () => {
          createInfoWindow(strike,marker)
        });
    }

  })
  new MarkerClusterer(map, markerArray, {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  });
}