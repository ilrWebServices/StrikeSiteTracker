//UTILS
function convertLatLngStringToObj(LatLngString) {
  const array = LatLngString.split(",");
  return {
    lat: Number(array[0]),
    lng: Number(array[1]),
  };
}
function formatDateToMMDDYYYY(dateString) {
  const dateArray = dateString.split("-");
  return `${dateArray[1]}/${dateArray[2]}/${dateArray[0]}`;
}
function selectCreator(ArrayOfOptions, element) {
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
const reportFormLink = 'https://docs.google.com/forms/d/e/1FAIpQLSdNP8zfmUU7jcrFVAS4fuP-EUUD2J86P11YlFXd7dE7Nn21zQ/viewform'
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
  "Accommodation and Food Services",
  "Administrative and Support and Waste Management",
  "Agriculture",
  "Arts",
  "Central Administrative Office Activity",
  "Construction",
  "Educational Services",
  "Finance and Insurance",
  "Health Care and Social Assistance",
  "Information",
  "Management of Companies and Enterprises",
  "Manufacturing",
  "Mining",
  "Other Services (except Public Administration)",
  "Professional",
  "Public Administration",
  "Real Estate and Rental and Leasing",
  "Retail Trade",
  "Transportation and Warehousing",
  "Utilities",
  "Wholesale Trade",
  "Entertainment and Recreation",
  "Fishing & Hunting",
  "Forestry,Scientific and Technical Services",
];
const WORKER_DEMAND = [
  "$15 minimum wage",
  "COVID-19 protocols",
  "First contract",
  "Health and safety",
  "Healthcare",
  "Job Security",
  "Pandemic Relief",
  "Pay",
  "Racial justice",
  "Staffing",
];
// Bargaining Unit Size
const UNIT_SIZE = {
  "Less than 100": "Bargaining_Unit_Size < 100",
  "Between 100 and 199":
    "Bargaining_Unit_Size >= 100 AND Bargaining_Unit_Size < 200",
  "Between 200 and 299":
    "Bargaining_Unit_Size >= 200 AND Bargaining_Unit_Size <= 299",
  "Between 300 and 499":
    "Bargaining_Unit_Size >= 300 AND Bargaining_Unit_Size <= 499",
  "Between 500 and 1999":
    "Bargaining_Unit_Size >= 500 AND Bargaining_Unit_Size <= 1999",
  "Greater than 2000": "Bargaining_Unit_Size >= 2000",
};
const DURATION_UNIT_DAY_CONDITION = ` AND Duration_Unit LIKE '%Days%'`;
const DURATION_UNIT_LESS_THAN_DAY_CONDITION = `(Duration_Amount <= 1 AND Duration_Unit LIKE '%Days%') OR ((Duration_Unit LIKE '%Hours%') OR (Duration_Unit LIKE '%Minutes%'))`;
const DURATION_ARRAY = {
  "1 day or less": DURATION_UNIT_LESS_THAN_DAY_CONDITION,
  "2-7 days":
    "Duration_Amount >= 2 AND Duration_Amount < 8" +
    DURATION_UNIT_DAY_CONDITION,
  "8-30 days":
    "Duration_Amount >= 8 AND Duration_Amount <= 30" +
    DURATION_UNIT_DAY_CONDITION,
  "31+ days": "Duration_Amount >= 31" + DURATION_UNIT_DAY_CONDITION,
};
const NO_OF_EMPLOEES = {
  "Less than 100": "Approximate_Number_of_Employees < 100",
  "Between 100 and 199":
    "Approximate_Number_of_Employees >= 100 AND Approximate_Number_of_Employees < 200",
  "Between 200 and 299":
    "Approximate_Number_of_Employees >= 200 AND Approximate_Number_of_Employees <= 299",
  "Between 300 and 499":
    "Approximate_Number_of_Employees >= 300 AND Approximate_Number_of_Employees <= 499",
  "Between 500 and 1999":
    "Approximate_Number_of_Employees >= 500 AND Approximate_Number_of_Employees <= 1999",
  "Greater than 2000": "Approximate_Number_of_Employees >= 2000",
};
// TABLE COLUMN NAMES
const tableDict = {
  Employer: {
    name: "Employer",
    type: "string",
  },
  "Labor Organization": {
    name: "Labor_Organization",
    type: "string",
    filter: filterLabourOrganization,
  },
  Local: {
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
  "Approximate Number of Participants": {
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
    filter: filterDuration,
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
  connectedRow: {
    name: "connectedRow",
    type: "string",
  },
  Notes: {
    name: "Notes",
    type: "string",
  },
};
const OR = " OR ";
//
// DOM FUNCTIZONS
function showSnackbar() {
  // Get the snackbar DIV
  const shownsnack = localStorage.getItem('shownsnack')
  // if(!shownsnack && window.innerWidth < 500){
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.setAttribute('style',`visibility: visible;-webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
    animation: fadein 0.5s, fadeout 0.5s 2.5s;`)
    console.log()
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.setAttribute('style',`visibility: hidden`) }, 6000);
    localStorage.setItem('shownsnack', true);
  // }
}
//FILTER FUNCTIONS
function filterDate(params) {
  if (params.fromDate && params.endDate)
    return `Start_Date >= '${params.fromDate}' and Start_Date <= '${params.endDate}'`;
  else return "";
}
function filterLabourOrganization(params) {
  if (params.searchTextLO)
    return `Labor_Organization LIKE '%${params.searchTextLO}%'`;
  else return "";
}
function filterUnitSize(params) {
  let filterString = "";
  params.unitSize.forEach((unitSizeKey, index) => {
    if (index !== 0) {
      filterString += OR;
    }
    filterString += `(${UNIT_SIZE[unitSizeKey]})`;
  });
  return filterString ? `(${filterString})` : "";
}
function filterNoOfEmp(params) {
  let filterString = "";
  params.NoOfEmp.forEach((empKey, index) => {
    if (index !== 0) {
      filterString += OR;
    }
    filterString += `(${NO_OF_EMPLOEES[empKey]})`;
  });
  return filterString ? `(${filterString})` : "";
}
function filterDuration(params) {
  let filterString = "";
  params.duration.forEach((durationKey, index) => {
    if (index !== 0) {
      filterString += OR;
    }
    filterString += `(${DURATION_ARRAY[durationKey]})`;
  });
  return filterString ? `(${filterString})` : "";
}
function filterType(params) {
  let filterString = "";

  params.typeArray.forEach((type, index) => {
    if (index !== 0) {
      filterString += OR;
    }
    filterString += `Strike_or_Protest LIKE '%${type}%'`;
  });
  return filterString ? `(${filterString})` : "";
}
function filterIndustry(params) {
  let filterString = "";
  params.industryValue.forEach((ind, index) => {
    if (index !== 0) {
      filterString += OR;
    }
    filterString += `Industry LIKE '%${ind}%'`;
  });
  return filterString ? `(${filterString})` : "";
}

function filterStates(params) {
  let filterString = "";
  params.stateValue.forEach((st, index) => {
    if (index !== 0) {
      filterString += OR;
    }
    filterString += `State LIKE '%${st}%'`;
  });
  return filterString ? `(${filterString})` : "";
}
function filterWorkerDemands(params) {
  let filterString = "";
  params.workerDemandsValue.forEach((wd, index) => {
    if (index !== 0) {
      filterString += OR;
    }
    filterString += `Worker_Demands LIKE '%${wd}%'`;
  });
  return filterString ? `(${filterString})` : "";
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
    const strikeNumber = Number(obj["Number of Locations"]) || 1;
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
  setTimeout(showSnackbar)
  await createTableAndInsertValues();
  // DATES
  const fromDate = document.getElementById("fromDate");
  const endDate = document.getElementById("endDate");
  const approvedCheckBox = document.getElementById("approved");
  const strikeValueCheckBox = document.getElementById("strikeValue");
  const protestValueCheckBox = document.getElementById("protestValue");
  const searchLabourOrganization = document.getElementById("labOrgSearch");
  const filterButton = document.getElementById("filterButton");
  const filterForm = document.getElementById("filterForm");
  const reportButton = document.getElementById("reportButton");
  reportButton.setAttribute("href",reportFormLink);
  const noBox = Array.prototype.slice.call(document.getElementsByClassName('no-box'))[0]
  noBox.classList.add('filter-box');
  noBox.classList.remove('no-box');
  filterForm.onsubmit = () => {
    return false;
  };
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
  const stateElement = document.getElementById("states");
  // INDUSTRY
  const industryElement = document.getElementById("industry");
  // WORKER DEMAND
  const wDElement = document.getElementById("workerDemand");
  // NO OF EMPLOYEES
  const NoOfEmp = document.getElementById("NoOfEmp");
  // UNIT SIZE RANGE
  const unitSize = document.getElementById("unitSize");
  // DURATION
  const duration = document.getElementById("duration");
  // ADD OPTIONS FROM OPTIONS LIST
  selectCreator(Object.keys(UNIT_SIZE), unitSize);
  selectCreator(Object.keys(NO_OF_EMPLOEES), NoOfEmp);
  selectCreator(Object.keys(DURATION_ARRAY), duration);
  selectCreator(WORKER_DEMAND, wDElement);
  selectCreator(INDUSTRY_LIST, industryElement);
  selectCreator(STATE_LIST, stateElement);
  // SET SLIM SELECT
  const stateSelect = new SlimSelect({
    select: "#states",
  });
  const industrySelect = new SlimSelect({
    select: "#industry",
  });
  const workerDemandSelect = new SlimSelect({
    select: "#workerDemand",
  });
  const unitSizeSelect = new SlimSelect({
    select: "#unitSize",
  });
  const durationSelect = new SlimSelect({
    select: "#duration",
  });
  const NoOfEmpSelect = new SlimSelect({
    select: "#NoOfEmp",
  });
  // ON SUMBIT OF FILTER FORM
  filterButton.onclick = async (event) => {
    const typeArray = [];
    if (strikeValueCheckBox.checked) {
      typeArray.push("Strike");
    }
    if (protestValueCheckBox.checked) {
      typeArray.push("Protest");
    }

    const paramValue = {
      fromDate: fromDate.value,
      endDate: endDate.value,
      typeArray: typeArray,
      Authorized: approvedCheckBox.checked,
      workerDemandsValue: workerDemandSelect.selected(),
      stateValue: stateSelect.selected(),
      industryValue: industrySelect.selected(),
      NoOfEmp: NoOfEmpSelect.selected(),
      unitSize: unitSizeSelect.selected(),
      duration: durationSelect.selected(),
      searchTextLO: searchLabourOrganization.value,
    };

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

  if(geodata.length){
    resultCountDiv.innerHTML = `<span class="resultText"><strong>${geodata.length}</strong> Results Found</span>`;
  }else{
    resultCountDiv.innerHTML = `It looks like you've requested information we haven't accounted for yet. Would you like to <a target="_blank" href="${reportFormLink}">report</a> a new strike or protest?`
  }
  listDiv.innerHTML = "";
  function createInfoWindow(strike, marker) {
    if (infowindow) {
      infowindow.close();
    }
    console.log('Outside')
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
    const chkId = `chkinput-${strike.positionId}`
    card.setAttribute("class", "tab");
    chklabel.setAttribute("class", "tab-label");
    chklabel.setAttribute("for", chkId);
    labelDiv.setAttribute("class", "labelDiv");
    chklabel.append(labelDiv);
    chkinput.setAttribute("type", "checkbox");
    chkinput.setAttribute("id",chkId );
    chkinput.setAttribute("class", "hidechk");
    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "tab-content");
    dateDiv.setAttribute("class", "date-card");
    infoDiv.setAttribute("class", "info-card");
    cardBody.innerHTML = createContentString(strike);
    const startDate = document.createElement("div");
    const endDate = document.createElement("div");
    startDate.innerHTML = `<strong>From</strong>: ${formatDateToMMDDYYYY(strike.Start_Date)}`;
    endDate.innerHTML = strike.End_Date
      ? `<strong>To</strong>: ${formatDateToMMDDYYYY(strike.End_Date)}`
      : "";
    employerDiv.innerHTML = strike.Employer
      ? `<strong>Employer</strong>: ${strike.Employer}`
      : "";
    loDiv.innerHTML = strike.Labor_Organization
      ? `<strong>Labor Organization</strong>: ${strike.Labor_Organization}`
      : "";
    infoDiv.append(employerDiv);
    infoDiv.append(loDiv);
    dateDiv.append(startDate);
    dateDiv.append(endDate);
    labelDiv.append(dateDiv);
    labelDiv.append(infoDiv);
    card.append(chkinput);
    card.append(chklabel);
    card.append(cardBody);
    chkinput.addEventListener("change", (e) => {
      console.log(e.target.checked,'<-----------------e.target.checked')
      if (e.target.checked) {
        const strikePosition = convertLatLngStringToObj(
          strike["Latitude_Longitude"]
        );
        map.setZoom(15);
        map.panTo(strikePosition);
        createInfoWindow(strike, marker);
        // addBounceToMarkers(strike)
      }
    });

    return card;
  }
  function createContentString(strike) {
    let htmlString = "";
    console.log('hy')
    Object.keys(tableDict).forEach((keyName) => {
      // console.log(strike[keyName])
      const colObj = tableDict[keyName];
      if (colObj.name == "source") {
        let sourceString = strike[colObj.name];
        const sourceArray = sourceString.split(";");
        const htmlSourceString = sourceArray.map((s, i) => {
          return `<a href="${s.trim()}" target="_blank" rel="noopener noreferrer">Source ${
            i + 1
          }</a>`;
        });
        htmlString += `<strong>${keyName}</strong> : ${htmlSourceString} </br>`;
      } else if (colObj.name == "Latitude_Longitude"){
        htmlString+= ''
      } else if (
        strike[colObj.name] &&
        (colObj.name === "Start_Date" || colObj.name === "End_Date")
      ) {
        htmlString += `<strong>${keyName}</strong> : ${formatDateToMMDDYYYY(
          strike[colObj.name]
        )} </br>`;
      } else if (strike[colObj.name] && colObj.name === "connectedRow") {
        const connectedRowArray =
          window.sameLocationDictionary[strike["connectedRow"]].array;
        const otherLocationsString = connectedRowArray
          .map((loc, locIndex) => {
            let tempMarker = null;
            window.markerArray.forEach((m, i) => {
              if (m.marker.get("id") === loc) {
                tempMarker = m;
              }
            });
            if (
              tempMarker &&
              tempMarker.strike["positionId"] !== strike["positionId"]
            ) {
              const strikePosition = convertLatLngStringToObj(
                tempMarker.strike["Latitude_Longitude"]
              );

              setTimeout(() => {
                document.getElementById(loc).onclick = () => {
                  console.log('sxaxsxs')
                  map.setZoom(15);
                  map.panTo(strikePosition);
                  createInfoWindow(tempMarker.strike, tempMarker.marker);
                };
              }, 2000);
              return `<div class="addressLink" id="${loc}">${
                tempMarker.strike["Address"]
                  ? tempMarker.strike["Address"] + ", "
                  : ""
              }${
                tempMarker.strike["City"]
                  ? tempMarker.strike["City"] + ", "
                  : ""
              }${
                tempMarker.strike["State"] ? tempMarker.strike["State"] : ""
              } </div><br/>`;
            } else {
              return "";
            }
          })
          .join("");
        htmlString += `<strong>These are the ${
          connectedRowArray.length - 1
        } labor actions that are connected to this labor action</strong><br>`;
        htmlString += otherLocationsString;
      } else if (strike[colObj.name] && colObj.name !== "positionId") {
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
  window.sameLocationDictionary = {};
  geodata.forEach((datum) => {
    const { connectedRow, positionId } = datum;
    if (connectedRow) {
      if (window.sameLocationDictionary[connectedRow]) {
        window.sameLocationDictionary[connectedRow].array.push(positionId);
      } else {
        window.sameLocationDictionary[connectedRow] = {
          toggle: false,
          array: [positionId],
        };
      }
    }
  });
  function addBounceToMarkers(strike) {
    if (window.sameLocationDictionary[strike["connectedRow"]]) {
      const bounds = new google.maps.LatLngBounds();
      window.sameLocationDictionary[strike["connectedRow"]].array.forEach(
        (loc, locIndex) => {
          window.markerArray.forEach((m, i) => {
            if (m.get("id") === loc) {
              if (
                window.sameLocationDictionary[strike["connectedRow"]].toggle
              ) {
                m.setAnimation(null);
              } else {
                m.setAnimation(google.maps.Animation.BOUNCE);
                bounds.extend(m.getPosition());
              }
            }
          });
        }
      );
      map.fitBounds(bounds);
      window.sameLocationDictionary[strike["connectedRow"]].toggle = !window
        .sameLocationDictionary[strike["connectedRow"]].toggle;
    }
  }
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
      marker.set("id", strike["positionId"]);
      window.markerArray.push({ marker, strike });
      marker.addListener("click", () => {
        createInfoWindow(strike, marker);
        // addBounceToMarkers(strike)
      });
    }
  });
  window.markerArray.forEach((obj, index) => {
          ///////
      const card = createCard(obj.strike, obj.marker);
      listDiv.append(card);
      ///////
  })
  new MarkerClusterer(
    map,
    window.markerArray.map((m) => m.marker),
    {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    }
  );
}
