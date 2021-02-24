

function convertLatLngStringToObj(LatLngString) {
  const array = LatLngString.split(',');
  return {
    lat: Number(array[0]),lng:Number(array[1])
  }
}
function mysql_real_escape_string (str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
      switch (char) {
          case "\0":
              return "\\0";
          case "\x08":
              return "\\b";
          case "\x09":
              return "\\t";
          case "\x1a":
              return "\\z";
          case "\n":
              return "\\n";
          case "\r":
              return "\\r";
          case "\"":
          case "'":
          case "\\":
          case "%":
              return "\\"+char; // prepends a backslash to backslash, percent,
                                // and double/single quotes
          default:
              return char;
      }
  });
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
  "Labor Organization": {
    "name": "Labor_Organization",
    "type": "string"
  },
  "Union Local": {
    "name": "Union_Local",
    "type": "string"
  },
  "Industry ": {
    "name": "Industry",
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
  "Strike or protest or lockout?": {
    "name": "Strike_or_protest_or_lockout",
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
    "name": "source",
    "type": "string"
  },
  "positionId": {
    "name": "positionId",
    "type": "string"
  }
}
async function createTableAndInsertValues(){
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
  await alasql.promise(`CREATE TABLE geodata (${createTableColStringAndType},  PRIMARY KEY (positionId))`);
  const geodatalen = window.geodata.length;
  console.log(geodatalen)
  window.geodata.forEach((obj, geoindex) => {
    let singleValueString = '';
    tableDictArray.forEach((key, index) => {
      singleValueString += `'${obj[key]?mysql_real_escape_string(String(obj[key])):''}'`
      if(index !== tableDictArrayLength-1){
        singleValueString += `,  `
      }
    })
    valuesString += `(${singleValueString})`
    if(geoindex !== geodatalen-1){
      valuesString += `,`
    }
  })
  await alasql.promise(`INSERT INTO geodata (${createTableColString}) VALUES ${valuesString}`)
  const res = await alasql.promise(`SELECT * from geodata WHERE Start_Date != '' AND Strike_or_protest_or_lockout LIKE '%Strike%' ORDER BY Start_Date  `)
  console.log(res)
  initMap(res)
}
window.addEventListener('load',async ()=> {
  console.log(window)
  await createTableAndInsertValues();
  // DATES
  const fromDate = document.getElementById('fromDate') 
  const endDate = document.getElementById('endDate') 
  const approvedCheckBox = document.getElementById('approved') 
  const toggleProtestCheckBox = document.getElementById('togglechk') 
  const stateSelect = document.getElementById('states') 
  const filterButton = document.getElementById('filterButton') 
  const minMaxDateObj = await alasql.promise(`SELECT MIN(Start_Date) as fromDate, MAX(Start_Date) as endDate from geodata where Start_Date != ''`);
  console.log(minMaxDateObj)
  fromDate.value = minMaxDateObj[0].fromDate
  endDate.value = minMaxDateObj[0].endDate
  // STATES
  STATE_LIST.forEach((val) => {
    var option = document.createElement("option");
    option.value = val;
    option.text = val
    stateSelect.appendChild(option);
  });
  console.log(fromDate.value,'<-----------------fromDate.value')
  console.log(endDate.value,'<-----------------endDate.value')
  filterButton.onclick  = async (event) => {
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
    strikeOrProtestQueryString = `AND Strike_or_protest_or_lockout LIKE '%Strike%'`
    if(toggleProtestCheckBox.checked){
      strikeOrProtestQueryString =`AND Strike_or_protest_or_lockout LIKE '%Protest%'`
    }
    const queryString = `SELECT * from geodata WHERE Start_Date >= '${fromDate.value}' and Start_Date <= '${endDate.value}' ${statesQueryString} ${strikeOrProtestQueryString} ${approvedQueryString} ORDER BY Start_Date`
    console.log(queryString)
    const res = await alasql.promise(queryString);
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
    chklabel.innerHTML = `${strike.Employer} - ${strike.Labor_Organization} -  ${strike.Start_Date}`;
    card.append(chkinput);
    card.append(chklabel);
    card.append(cardBody);
    chkinput.addEventListener('change',(e) => {
      if(e.target.checked){
        const strikePosition = convertLatLngStringToObj(strike['Latitude_Longitude']);
        map.setZoom(15);
        map.panTo(strikePosition);
        createInfoWindow(strike,marker)
      }

    })
 
    return card
  }
  function createContentString(strike) {
    let htmlString = ''
    Object.keys(tableDict).forEach((keyName) => {
      // console.log(strike[keyName])
      const colObj = tableDict[keyName];
      if(strike[colObj.name] && colObj.name!=='positionId'){
        htmlString += `<strong>${keyName}</strong> : ${strike[colObj.name]} </br>`
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