//UTILS
function convertLatLngStringToObj(LatLngString) {
  const array = LatLngString.split(",");
  return {
    lat: Number(array[0]),
    lng: Number(array[1]),
  };
}
function formatDateToMMDDYYYY(dateString){
  const dateArray = dateString.split('-');
  return `${dateArray[1]}/${dateArray[2]}/${dateArray[0]}`
}
function selectCreator(ArrayOfOptions, element){
  ArrayOfOptions.forEach((val) => {
    var option = document.createElement("option");
    option.value = val;
    option.text = val;
    element.appendChild(option);
  });
}
function mysql_real_escape_string(str) {
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
      case '"':
      case "'":
      case "\\":
      case "%":
        return "\\" + char; // prepends a backslash to backslash, percent,
      // and double/single quotes
      default:
        return char;
    }
  });
}
// CONSTANTS
// OPTION LISTS
const STATE_LIST = [
  "Alabama",
  "Alaska",
  "American Samoa",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District Of Columbia",
  "Federated States Of Micronesia",
  "Florida",
  "Georgia",
  "Guam",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Marshall Islands",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Northern Mariana Islands",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Palau",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virgin Islands",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];
const INDUSTRY_LIST = [
  "Agriculture, Forestry, Fishing & Hunting",
  "Mining",
  "Utilities",
  "Construction",
  "Manufacturing",
  "Wholesale Trade",
  "Retail Trade",
  "Transportation and Warehousing",
  "Real Estate and Rental and Leasing",
  "Professional, Scientific and Technical Services",
  "Management of Companies and Enterprises",
  "Administrative and Support and Waste Management",
  "Educational Services",
  "Information",
  "Finance and Insurance",
  "Health Care and Social Assistance",
  "Arts, Entertainment and Recreation",
  "Accommodation and Food Services",
  "Other Services (except Public Administration)",
  "Central Administrative Office Activity",
  "Public Administration",
];
const WORKER_DEMAND = [
  "Pay",
  "Healthcare",
  "COVID-19 protocols",
  "Health and safety",
  "First contract",
  "Racial justice",
  "$15 minimum wage",
  "Staffing",
];
// Bargaining Unit Size
const UNIT_SIZE = {
  'LESS THAN 100':'Bargaining_Unit_Size < 100',
  'BETWEEN 100 AND 199':'Bargaining_Unit_Size >= 100 AND Bargaining_Unit_Size < 200',
  'BETWEEN 200 AND 299':'Bargaining_Unit_Size >= 200 AND Bargaining_Unit_Size <= 299',
  'BETWEEN 300 AND 499':'Bargaining_Unit_Size >= 300 AND Bargaining_Unit_Size <= 499',
  'BETWEEN 500 AND 1999':'Bargaining_Unit_Size >= 500 AND Bargaining_Unit_Size <= 1999',
  'GREATER THAN 2000':'Bargaining_Unit_Size >= 2000',
}
const NO_OF_EMPLOEES = {
  'LESS THAN 100':'Approximate_Number_of_Employees < 100',
  'BETWEEN 100 AND 199':'Approximate_Number_of_Employees >= 100 AND Approximate_Number_of_Employees < 200',
  'BETWEEN 200 AND 299':'Approximate_Number_of_Employees >= 200 AND Approximate_Number_of_Employees <= 299',
  'BETWEEN 300 AND 499':'Approximate_Number_of_Employees >= 300 AND Approximate_Number_of_Employees <= 499',
  'BETWEEN 500 AND 1999':'Approximate_Number_of_Employees >= 500 AND Approximate_Number_of_Employees <= 1999',
  'GREATER THAN 2000':'Approximate_Number_of_Employees >= 2000',
}
// TABLE COLUMN NAMES
const tableDict = {
  Employer: {
    name: "Employer",
    type: "string",
  },
  "Labor Organization": {
    name: "Labor_Organization",
    type: "string",
    "filter": filterLabourOrganization
  },
  "Local": {
    name: "Local",
    type: "string",
  },
  Industry: {
    name: "Industry",
    type: "string",
    filter: filterIndustry,
  },
  "Bargaining Unit Size": {
    name: "Bargaining_Unit_Size",
    type: "number",
    filter: filterUnitSize,
  },
  "Number of Locations": {
    name: "Number_of_Locations",
    type: "number",
  },
  "Latitude, Longitude": {
    name: "Latitude_Longitude",
    type: "string",
  },
  Address: {
    name: "Address",
    type: "string",
  },
  City: {
    name: "City",
    type: "string",
  },
  State: {
    name: "State",
    type: "string",
    filter: filterStates,
  },
  "Zip Code": {
    name: "Zip_Code",
    type: "string",
  },
  "Strike or Protest": {
    name: "Strike_or_Protest",
    type: "string",
    filter: filterType,
  },
  "Approximate  Number of Employees": {
    name: "Approximate_Number_of_Employees",
    type: "number",
    filter: filterNoOfEmp,
  },
  "Start Date": {
    name: "Start_Date",
    type: "date",
    filter: filterDate,
  },
  "End Date": {
    name: "End_Date",
    type: "date",
  },
  "Duration Amount": {
    name: "Duration_Amount",
    type: "number",
  },
  "Duration Unit": {
    name: "Duration_Unit",
    type: "string",
  },
  Authorized: {
    name: "Authorized",
    type: "string",
    filter: filterAuthorized,
  },
  Threat: {
    name: "Threat",
    type: "string",
  },
  "Worker Demands": {
    name: "Worker_Demands",
    type: "string",
    filter: filterWorkerDemands,
  },
  Source: {
    name: "source",
    type: "string",
  },
  positionId: {
    name: "positionId",
    type: "string",
  },
  connectedRow:{
    name: "connectedRow",
    type: "string",
  }
};
const OR = " OR ";

//FILTER FUNCTIONS
function filterDate(params) {
  if (params.fromDate && params.endDate)
    return `Start_Date >= '${params.fromDate}' and Start_Date <= '${params.endDate}'`;
  else return "";
}
function filterLabourOrganization(params) {
  console.log(params.searchTextLO)
  if(params.searchTextLO)
    return `Labor_Organization LIKE '%${params.searchTextLO}%'`
  else return ''
}
function filterUnitSize(params) {
  let filterString = "";
  params.unitSize.forEach((unitSizeKey, index) => {
    if (index !== 0) {
      filterString += OR;
    }
    filterString += `(${UNIT_SIZE[unitSizeKey]})`;
  });
  return filterString?`(${filterString})`:'';
}
function filterNoOfEmp(params) {
  let filterString = "";
  params.NoOfEmp.forEach((empKey, index) => {
    if (index !== 0) {
      filterString += OR;
    }
    filterString += `(${NO_OF_EMPLOEES[empKey]})`;
  });
  return filterString?`(${filterString})`:'';
}
function filterType(params) {
  let filterString = "";
  
  params.typeArray.forEach((type, index) => {
    if (index !== 0) {
      filterString += OR;
    }
    filterString += `Strike_or_Protest LIKE '%${type}%'`;
  });
  return filterString?`(${filterString})`:'';
}
function filterIndustry(params) {
  let filterString = "";
  params.industryValue.forEach((ind, index) => {
    if (index !== 0) {
      filterString += OR;
    }
    filterString += `Industry LIKE '%${ind}%'`;
  });
  return filterString?`(${filterString})`:'';
  }

function filterStates(params) {
  let filterString = "";
  params.stateValue.forEach((st, index) => {
    if (index !== 0) {
      filterString += OR;
    }
    filterString += `State LIKE '%${st}%'`;
  });
  return filterString?`(${filterString})`:'';
}
function filterWorkerDemands(params) {
  let filterString = "";
  params.workerDemandsValue.forEach((wd, index) => {
    if (index !== 0) {
      filterString += OR;
    }
    filterString += `Worker_Demands LIKE '%${wd}%'`;
  });
  return filterString?`(${filterString})`:'';
}
function filterAuthorized(params) {
  let filterString = "";
  if (params.Authorized) {
    filterString = `Authorized='N'`;
  }
  return filterString;
}
// CONVERT JSON INTO SQL DATABASE (PREPROCESSING DATA)
async function createTableAndInsertValues() {

  //  TABLE CREATION STING
  let createTableColStringAndType = "";
  let createTableColString = "";
  const tableDictArray = Object.keys(tableDict);
  const tableDictArrayLength = tableDictArray.length;
  tableDictArray.forEach((key, index) => {
    createTableColString += `${tableDict[key].name} `;
    createTableColStringAndType += `${tableDict[key].name} ${tableDict[key].type}`;
    if (index !== tableDictArrayLength - 1) {
      createTableColString += `, `;
      createTableColStringAndType += ", ";
    }
  });
  let valuesString = "";
  let queryString = `CREATE TABLE geodata (${createTableColStringAndType},  PRIMARY KEY (positionId))`;
  await alasql.promise(queryString);
  // SANATIZING VALUES ADDING VALUES TO TABLE
  const geodatalen = window.geodata.length;
  console.log(geodatalen);
  window.geodata.forEach((obj, geoindex) => {
    const strikeNumber = Number(obj["Number of Strike Location"]) || 1;
    // IF MULTIPLE LOCATION STRIKE
    if (strikeNumber > 1) {
      const latlngArray = obj["Latitude, Longitude"].split(";");
      const addressArray = obj["Address"].split(";");
      const cityArray = obj["City"].split(";");
      const stateArray = obj["State"].split(";");
      const zipCodeArray = obj["Zip Code"].split(";");
      const latlngArrayLength = latlngArray.length - 1;
      const addressArrayLength = addressArray.length;
      const cityArrayLength = cityArray.length;
      const stateArrayLength = stateArray.length;
      const zipCodeArrayLength = zipCodeArray.length;
      if (
        latlngArrayLength === strikeNumber &&
        addressArrayLength === strikeNumber &&
        cityArrayLength === strikeNumber &&
        stateArrayLength === stateArrayLength &&
        strikeNumber === zipCodeArrayLength
      ) {
        const singleEventArray = [];
        for (let index = 0; index < strikeNumber; index++) {
          singleEventArray.push({
            ...obj,
            connectedRow: obj["positionId"],
            positionId: obj["positionId"] + "." + index,
            "Latitude, Longitude": latlngArray[index],
            Address: addressArray[index],
            City: cityArray[index],
            State: stateArray[index],
            "Zip Code": zipCodeArray[index],
          });
        }
        singleEventArray.forEach((singleEvent, i) => {
          let singleValueString = "";
          tableDictArray.forEach((key, index) => {
            if (
              tableDict[key].type === "string" ||
              tableDict[key].type === "date"
            ) {
              singleValueString += `'${
                singleEvent[key]
                  ? mysql_real_escape_string(String(singleEvent[key]))
                  : ""
              }'`;
            } else if (tableDict[key].type === "number") {
              singleValueString +=
                Number(singleEvent[key]) && !isNaN(Number(singleEvent[key]))
                  ? Number(singleEvent[key])
                  : 0;
            }
            if (index !== tableDictArrayLength - 1) {
              singleValueString += `,  `;
            }
          });

          valuesString += `(${singleValueString})`;

          if (!(i === strikeNumber - 1 && geoindex === geodatalen - 1)) {
            valuesString += `,`;
          }
        });
      } else {
        console.log("Length", obj);
        console.error("Mismatch");
      }
    }
    // IF SINGLE LOCATION STRIKE 
    else if (strikeNumber === 1) {
      let singleValueString = "";
      tableDictArray.forEach((key, index) => {
        if (
          tableDict[key].type === "string" ||
          tableDict[key].type === "date"
        ) {
          singleValueString += `'${
            obj[key] ? mysql_real_escape_string(String(obj[key])) : ""
          }'`;
        } else if (tableDict[key].type === "number") {
          singleValueString +=
            Number(obj[key]) && !isNaN(Number(obj[key])) ? Number(obj[key]) : 0;
        }
        if (index !== tableDictArrayLength - 1) {
          singleValueString += `,  `;
        }
      });

      valuesString += `(${singleValueString})`;
      if (geoindex !== geodatalen - 1) {
        valuesString += `,`;
      }
    }
  });
  await alasql.promise(
    `INSERT INTO geodata (${createTableColString}) VALUES ${valuesString}`
  );
  const res = await alasql.promise(
    `SELECT * from geodata WHERE Start_Date != '' AND Strike_or_Protest LIKE '%Strike%' ORDER BY Start_Date  `
  );
  initMap(res);
}
// ON LOAD EVENT (INITIALIZATION)
window.addEventListener("load", async () => {
  await createTableAndInsertValues();
  // DATES
  const fromDate = document.getElementById("fromDate");
  const endDate = document.getElementById("endDate");
  const approvedCheckBox = document.getElementById("approved");
  const strikeValueCheckBox = document.getElementById("strikeValue");
  const protestValueCheckBox = document.getElementById("protestValue");
  const lockoutValueCheckBox = document.getElementById("lockoutValue");
  const unitSizeRange = document.getElementById("unitSize");
  const NoOfEmpRange = document.getElementById("NoOfEmp");
  const searchLabourOrganization = document.getElementById("labOrgSearch");
  const filterButton = document.getElementById("filterButton");
  const filterForm = document.getElementById("filterForm");
  filterForm.onsubmit = () => {
    return false;
  }
  const minMaxDateObj = await alasql.promise(
    `SELECT MIN(Start_Date) as fromDate, MAX(Start_Date) as endDate from geodata where Start_Date != ''`
  );
  // TYPE
  // lockoutValueCheckBox.checked = true;
  // protestValueCheckBox.checked = true;
  strikeValueCheckBox.checked = true;
  // DATE
  fromDate.value = minMaxDateObj[0].fromDate;
  endDate.value = minMaxDateObj[0].endDate;
  // STATES
  const stateElement = document.getElementById("states")
  // INDUSTRY
  const industryElement = document.getElementById("industry")
  // WORKER DEMAND
  const wDElement = document.getElementById("workerDemand")
  // NO OF EMPLOYEES
  const NoOfEmp = document.getElementById("NoOfEmp")
  // UNIT SIZE RANGE
  const unitSize = document.getElementById("unitSize");
  // ADD OPTIONS FROM OPTIONS LIST
  selectCreator(Object.keys(UNIT_SIZE),unitSize)
  selectCreator(Object.keys(NO_OF_EMPLOEES),NoOfEmp)
  selectCreator(WORKER_DEMAND,wDElement)
  selectCreator(INDUSTRY_LIST,industryElement)
  selectCreator(STATE_LIST,stateElement)
  // SET SLIM SELECT
  const stateSelect = (new SlimSelect({
    select: '#states'
  }))
  const industrySelect = (new SlimSelect({
    select: '#industry'
  }))
  const workerDemandSelect = (new SlimSelect({
    select: '#workerDemand'
  }))
  const unitSizeSelect = (new SlimSelect({
    select: '#unitSize'
  }))
  const NoOfEmpSelect = (new SlimSelect({
    select: '#NoOfEmp'
  }))
  // ON SUMBIT OF FILTER FORM
  filterButton.onclick = async (event) => {
    console.log(fromDate.value, "<-----------------fromDate.value");
    console.log(endDate.value, "<-----------------endDate.value");
    console.log(
      approvedCheckBox.checked,
      "<-----------------approvedCheckBox.value"
    );
    console.log(stateSelect.value, "<-----------------stateSelect.value");
    const typeArray = [];
    console.log(protestValueCheckBox);
    if (strikeValueCheckBox.checked) {
      typeArray.push("Strike");
    }
    if (protestValueCheckBox.checked) {
      typeArray.push("Protest");
    }
    if (lockoutValueCheckBox.checked) {
      typeArray.push("Lockout");
    }

    const paramValue = {
      fromDate:fromDate.value,
      endDate: endDate.value,
      typeArray:typeArray,
      Authorized: approvedCheckBox.checked,
      workerDemandsValue:  workerDemandSelect.selected(),
      stateValue: stateSelect.selected(),
      industryValue:industrySelect.selected(),
      NoOfEmp: NoOfEmpSelect.selected(),
      unitSize:unitSizeSelect.selected(),
      searchTextLO:searchLabourOrganization.value,
    }
    
    console.log(paramValue);
    let cString = "";
    let filterCount = 0;
    Object.keys(tableDict).forEach((key, index) => {
      if (typeof tableDict[key].filter === "function") {
        const stringValue = tableDict[key].filter(paramValue);
        if (stringValue) {
          if (filterCount !== 0) {
            cString += " AND ";
          }
          filterCount += 1;
          cString += stringValue;
        }
      }
    });
    console.log(cString);
    const queryString = `SELECT * from geodata WHERE ${cString} ORDER BY Start_Date`;
    console.log(queryString);
    const res = await alasql.promise(queryString);
    initMap(res);
    console.log(res);
  };
});


// Initialize and add the map
function initMap(geodata) {
  let infowindow = null;
  let currWindow = false;
  const listDiv = document.getElementById("list-box");
  const resultCountDiv = document.getElementById("resultCount");
  resultCountDiv.innerHTML = `${geodata.length} Results Found`
  listDiv.innerHTML = "";
  function createInfoWindow(strike, marker) {
    if (infowindow) {
      infowindow.close();
    }
    infowindow = new google.maps.InfoWindow({
      content: createContentString(strike),
    });
    infowindow.open(map, marker);
  }
  function createCard(strike, marker) {
    const card = document.createElement("div");
    const chkinput = document.createElement("input");
    const chklabel = document.createElement("label");
    const labelDiv = document.createElement("div");
    const dateDiv = document.createElement("div");
    const infoDiv = document.createElement("div");
    const employerDiv = document.createElement("div");
    const loDiv = document.createElement("div");
    card.setAttribute("class", "tab");
    chklabel.setAttribute("class", "tab-label");
    chklabel.setAttribute("for", strike.positionId);
    labelDiv.setAttribute("class", "labelDiv");
    chklabel.append(labelDiv)
    chkinput.setAttribute("type", "checkbox");
    chkinput.setAttribute("id", strike.positionId);
    chkinput.setAttribute("class", "hidechk");
    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "tab-content");
    dateDiv.setAttribute("class", "date-card");
    infoDiv.setAttribute("class", "info-card");
    cardBody.innerHTML = createContentString(strike);
    const startDate = document.createElement("div");
    const endDate = document.createElement("div");
    startDate.innerHTML = `From: ${formatDateToMMDDYYYY(strike.Start_Date)}`;
    endDate.innerHTML = strike.End_Date?`To: ${formatDateToMMDDYYYY(strike.End_Date)}`:'';
    employerDiv.innerHTML = strike.Employer?`Employer: ${strike.Employer}`:'';
    loDiv.innerHTML = strike.Labor_Organization?`Labor Organization: ${strike.Labor_Organization}`:'';
    infoDiv.append(employerDiv)
    infoDiv.append(loDiv)
    dateDiv.append(startDate)
    dateDiv.append(endDate)
    labelDiv.append(dateDiv)
    labelDiv.append(infoDiv)
    card.append(chkinput);
    card.append(chklabel);
    card.append(cardBody);
    chkinput.addEventListener("change", (e) => {
      if (e.target.checked) {
        const strikePosition = convertLatLngStringToObj(
          strike["Latitude_Longitude"]
        );
        // map.setZoom(15);
        // map.panTo(strikePosition);
        createInfoWindow(strike, marker);
        addBounceToMarkers(strike)
      }
    });

    return card;
  }
  function createContentString(strike) {
    let htmlString = "";
    Object.keys(tableDict).forEach((keyName) => {
      // console.log(strike[keyName])
      const colObj = tableDict[keyName];
      if (colObj.name == "source") {
        let sourceString = strike[colObj.name];
        if (sourceString.indexOf("1. ") === -1) {
          htmlString += `<strong>${keyName}</strong> : <a href="${sourceString}" target="_blank" rel="noopener noreferrer" ">Source</a> </br>`;
        } else {
          let finalString = "";
          let sourceStringArray = sourceString.split("\\n");
          let count = 0;
          sourceStringArray.forEach((string, index) => {
            if (string) {
              count = count + 1;
              finalString += ` <a href="${string
                .replace(`${count}.`, "")
                .trim()}" target="_blank" rel="noopener noreferrer">Source ${count}</a> `;
            }
          });
          htmlString += `<strong>${keyName}</strong> : ${finalString} </br>`;
        }
      }else if(strike[colObj.name] && (colObj.name === "Start_Date" || colObj.name === "End_Date")){
        htmlString += `<strong>${keyName}</strong> : ${
          formatDateToMMDDYYYY(strike[colObj.name])
        } </br>`;
      }
      else if (strike[colObj.name] && colObj.name !== "positionId") {
        htmlString += `<strong>${keyName}</strong> : ${
          strike[colObj.name]
        } </br>`;
      }
    });
    return htmlString;
  }
  // The location of Uluru
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    // center: convertLatLngStringToObj(geodata[0]['Latitude_Longitude'])
    center: { lat: 39.7427825897816, lng: -101.69676383031963 },
  });
  window.markerArray = [];
  window.sameLocationDictionary = {}
  geodata.forEach((datum) => {
    const { connectedRow,positionId } = datum;
    if(connectedRow){
      console.log(connectedRow)
      if(window.sameLocationDictionary[connectedRow]){
        window.sameLocationDictionary[connectedRow].array.push(positionId)
      }else{
        window.sameLocationDictionary[connectedRow] = {toggle:false,array:[positionId]}
      }
    }
  })
  function addBounceToMarkers(strike){
    if(window.sameLocationDictionary[strike['connectedRow']]){
      const bounds = new google.maps.LatLngBounds();
      window.sameLocationDictionary[strike['connectedRow']].array.forEach((loc, locIndex) => {
        window.markerArray.forEach((m,i) => {
          if(m.get('id') === loc){
            if(window.sameLocationDictionary[strike['connectedRow']].toggle){
              m.setAnimation(null);
            }else{
              m.setAnimation(google.maps.Animation.BOUNCE);
              bounds.extend(m.getPosition());
            }
              
          }
        })
      })
      map.fitBounds(bounds);
      window.sameLocationDictionary[strike['connectedRow']].toggle = !window.sameLocationDictionary[strike['connectedRow']].toggle
    }
  }
  console.log(window.sameLocationDictionary['23'])
  // The marker, positioned at Uluru
  geodata.forEach((strike, index) => {
    if (strike["Latitude_Longitude"]) {
      const strikePosition = convertLatLngStringToObj(
        strike["Latitude_Longitude"]
      );
      const marker = new google.maps.Marker({
        position: strikePosition,
        map: map,
        title: strike.City,
      });
      marker.set("id", strike['positionId']);
      window.markerArray.push(marker);
      const card = createCard(strike, marker);
      listDiv.append(card);
      
      marker.addListener("click", () => {
        createInfoWindow(strike, marker);
        // console.log(next,'<-----------------next')
        console.log('In',window.sameLocationDictionary[strike['connectedRow']],strike['connectedRow'])
        addBounceToMarkers(strike)
      });
    }
  });
  new MarkerClusterer(map, window.markerArray, {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  });
}
