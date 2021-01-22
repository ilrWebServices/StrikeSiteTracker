

function convertLatLngStringToObj(LatLngString) {
  const array = LatLngString.split(',');
  return {
    lat: Number(array[0]),lng:Number(array[1])
  }
}
const STATE_LIST = ['All',"Alabama", "Alaska", "American Samoa", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District Of Columbia", "Federated States Of Micronesia", "Florida", "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Marshall Islands", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Northern Mariana Islands", "Ohio", "Oklahoma", "Oregon", "Palau", "Pennsylvania", "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virgin Islands", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
function formatDate(d) {
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}
const tableDict = {
  "Employer": {
    "name": "Employer",
    "type": "string"
  },
  "Union": {
    "name": "Union_Name",
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
    "name": "Latitude_Longitude",
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
    "name": "Strike_or_lockout",
    "type": "string"
  },
  "approx # Ees on stoppage": {
    "name": "Approx_Size",
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
    "name": "Authorized",
    "type": "string"
  },
  "Threat?": {
    "name": "Threat",
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
function createTableAndInsertValues(){
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
  alasql(`CREATE TABLE geodata (${createTableColStringAndType},  PRIMARY KEY (positionId))`);
  const geodatalen = window.geodata.length;
  // [window.geodata[0],window.geodata[1],window.geodata[2]].forEach((obj, geoindex) => {
  window.geodata.forEach((obj, geoindex) => {
    let singleValueString = '';
    tableDictArray.forEach((key, index) => {
      singleValueString += `'${obj[key]?obj[key]:''}'`
      if(index !== tableDictArrayLength-1){
        singleValueString += `,  `
      }
    })
    valuesString += `(${singleValueString})`
    if(geoindex !== geodatalen-1){
      valuesString += `,`
    }
  })
  alasql(`INSERT INTO geodata (${createTableColString}) VALUES ${valuesString}`)
  const res = alasql(`SELECT * from geodata WHERE Start_Date != '' AND Strike_or_lockout LIKE '%Strike%' ORDER BY Start_Date  `)
  console.log(res)
  initMap(res)
}
window.addEventListener('load',()=> {
  console.log(window)
  createTableAndInsertValues();
  // DATES
  const fromDate = document.getElementById('fromDate') 
  const endDate = document.getElementById('endDate') 
  const approvedCheckBox = document.getElementById('approved') 
  const toggleProtestCheckBox = document.getElementById('togglechk') 
  const stateSelect = document.getElementById('states') 
  const filterButton = document.getElementById('filterButton') 
  const minMaxDateObj = alasql(`SELECT MIN(Start_Date) as fromDate, MAX(Start_Date) as endDate from geodata where Start_Date != ''`)[0];
  fromDate.value = minMaxDateObj.fromDate
  endDate.value = minMaxDateObj.endDate
  // STATES
  STATE_LIST.forEach((val) => {
    var option = document.createElement("option");
    option.value = val;
    option.text = val
    stateSelect.appendChild(option);
  });
  filterButton.onclick  = (event) => {
    console.log(fromDate.value,'<-----------------fromDate.value')
    console.log(endDate.value,'<-----------------endDate.value')
    console.log(approvedCheckBox.checked,'<-----------------approvedCheckBox.value')
    console.log(stateSelect.value,'<-----------------stateSelect.value')
    let statesQueryString = '';
    if(stateSelect.value !== 'All'){
      statesQueryString = `AND State LIKE '%${stateSelect.value}%'`
    }
    let approvedQueryString = '';
    if(approvedCheckBox.checked){
      approvedQueryString = `AND Authorized='N'`
    }
    strikeOrProtestQueryString = `AND Strike_or_lockout LIKE '%Strike%'`
    if(toggleProtestCheckBox.checked){
      strikeOrProtestQueryString =`AND Strike_or_lockout LIKE '%Protest%'`
    }
    const queryString = `SELECT * from geodata WHERE Start_Date >= '${fromDate.value}' and Start_Date <= '${endDate.value}' ${statesQueryString} ${strikeOrProtestQueryString} ${approvedQueryString} ORDER BY Start_Date`
    console.log(queryString)
    const res = alasql(queryString);
    console.log(res)
    initMap(res)
  }

})



// Initialize and add the map
function initMap(geodata) {
  let infowindow = null
  let currWindow =false; 
  const listDiv = document.getElementById('list-box');
  listDiv.innerHTML = '';
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
    const chkinput = document.createElement('input');
    const chklabel = document.createElement('label');
    card.setAttribute("class", "tab");
    chklabel.setAttribute("class", "tab-label");
    chklabel.setAttribute("for", strike.positionId);
    chkinput.setAttribute("type", "checkbox");
    chkinput.setAttribute("id", strike.positionId);
    chkinput.setAttribute("class", 'hidechk');
    const cardBody = document.createElement('div');
    cardBody.setAttribute("class", "tab-content");
    cardBody.innerHTML = createContentString(strike)
    chklabel.innerHTML = `${strike.Employer} - ${strike.Union_Name}`;
    card.append(chkinput);
    card.append(chklabel);
    card.append(cardBody);
    chklabel.addEventListener('click',() => {
      console.log('Inside OnCLick')
      const strikePosition = convertLatLngStringToObj(strike['Latitude_Longitude']);
      map.setZoom(15);
      map.panTo(strikePosition);
      createInfoWindow(strike,marker)
    })
 
    return card
  }
  function createContentString(strike) {
    let htmlString = ''
    Object.keys(strike).forEach((keyName) => {
      // console.log(strike[keyName])
      if(strike[keyName] && keyName!=='positionId'){
        htmlString += `<strong>${keyName}</strong> : ${strike[keyName]} </br>`
      }
     
  })
  return htmlString
  }
  // The location of Uluru
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
      zoom:4,
      // center: convertLatLngStringToObj(geodata[0]['Latitude_Longitude'])
      center: {lat: 39.7427825897816, lng: -101.69676383031963}
  });
  const markerArray = []
  // The marker, positioned at Uluru
  geodata.forEach((strike,index) => {

    if(strike['Latitude_Longitude']){
      const strikePosition = convertLatLngStringToObj(strike['Latitude_Longitude'])
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