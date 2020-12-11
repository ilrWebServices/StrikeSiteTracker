
const dummyData = [
    {
      "Employer": "11 Infinity Healthcare Management of Illinois Facilities",
      "Union": "SEIU Healthcare",
      "Union Local": "",
      "Bargaining Unit Size": "",
      "Lat": 41.878113,
      "Lng": -87.629799,
      "City": "Chicago, Cicero, Niles, Itasca, Streator, Bloomingdale, Momence",
      "State": "Illinois",
      "approx # Employees on strike": 700,
      "Start Date": "11/23/2020",
      "End Date": "",
      "Worker Demands": "Hazrd Pay, Higher Wages, PPE",
      "Source": "https://www.chicagotribune.com/coronavirus/ct-illinois-nursing-home-strike-20201123-yhloq3vzp5guvenvscjq7y4vlm-story.html",
      "Comment": ""
    },
    {
      "Employer": "Allina Abbott -\nNorthwestern Hospital",
      "Union": "SEIU Healthcare Minnesota",
      "Union Local": "",
      "Bargaining Unit Size": 101,
      "Lat": 44.977753,
      "Lng": -93.265015,
      "City": "Minneapolis",
      "State": "Minnesota",
      "approx # Employees on strike": 101,
      "Start Date": "10/5/2020",
      "End Date": "10/6/2020",
      "Worker Demands": "",
      "Source": "https://www.fmcs.gov/wp-content/uploads/2020/11/October-2020-Work-Stoppages.pdf",
      "Comment": ""
    },
    {
      "Employer": "AstenJohnson",
      "Union": "IAMAW",
      "Union Local": "",
      "Bargaining Unit Size": 87,
      "Lat": 44.261932,
      "Lng": -88.415382,
      "City": "Appleton",
      "State": "Wisconsin",
      "approx # Employees on strike": 87,
      "Start Date": "10/16/2020",
      "End Date": "10/26/2020",
      "Worker Demands": "",
      "Source": "",
      "Comment": ""
    },
    {
      "Employer": "Bannister House",
      "Union": "NEHCE",
      "Union Local": "1199 NE",
      "Bargaining Unit Size": 145,
      "Lat": 36.311005,
      "Lng": -94.127434,
      "City": "Providence",
      "State": "Rhode Island",
      "approx # Employees on strike": 135,
      "Start Date": "10/2/2020",
      "End Date": "10/4/2020",
      "Worker Demands": "",
      "Source": "https://www.fmcs.gov/wp-content/uploads/2020/11/October-2020-Work-Stoppages.pdf",
      "Comment": ""
    },
    {
      "Employer": "Youngstown State Universery",
      "Union": "Ohio Education Association",
      "Union Local": "",
      "Bargaining Unit Size": "",
      "Lat": 41.099781,
      "Lng": -80.649521,
      "City": "Youngstown",
      "State": "Ohio",
      "approx # Employees on strike": 400,
      "Start Date": "10/13/2020",
      "End Date": "10/16/2020",
      "Worker Demands": "",
      "Source": "https://www.fmcs.gov/wp-content/uploads/2020/11/October-2020-Work-Stoppages.pdf",
      "Comment": ""
    },
    {
      "Employer": "Gahanna Schools",
      "Union": "OEA",
      "Union Local": "",
      "Bargaining Unit Size": 570,
      "Lat": 40.04156952,
      "Lng": -82.87819217,
      "City": "Gahanna",
      "State": "Ohio",
      "approx # Employees on strike": 6,
      "Start Date": "10/13/2020",
      "End Date": "10/18/2020",
      "Worker Demands": "",
      "Source": "https://www.fmcs.gov/wp-content/uploads/2020/11/October-2020-Work-Stoppages.pdf",
      "Comment": ""
    },
    {
      "Employer": "Four Seasons Nursing Center",
      "Union": "SEIU Healthcare",
      "Union Local": "",
      "Bargaining Unit Size": "",
      "Lat": 42.33617034,
      "Lng": -83.3890687,
      "City": "Westland",
      "State": "Michigan",
      "approx # Employees on strike": 50,
      "Start Date": "10/19/2020",
      "End Date": "10/20/2020",
      "Worker Demands": "",
      "Source": "1. https://www.fmcs.gov/wp-content/uploads/2020/11/October-2020-Work-Stoppages.pdf\n\n2. https://www.fox2detroit.com/news/nursing-home-workers-at-westland-facility-walk-off-job-in-protest",
      "Comment": ""
    },
    {
      "Employer": "Northern Mechanical Contractors Association",
      "Union": "Plumbers and Steam Fitters / United Association 11",
      "Union Local": "",
      "Bargaining Unit Size": 360,
      "Lat": 46.87674821,
      "Lng": -92.1134572,
      "City": "Duluth",
      "State": "Minnesota",
      "approx # Employees on strike": 160,
      "Start Date": "10/26/2020",
      "End Date": "",
      "Worker Demands": "",
      "Source": "https://www.fmcs.gov/wp-content/uploads/2020/11/October-2020-Work-Stoppages.pdf",
      "Comment": ""
    },
    {
      "Employer": "Cash-Wa Distributing",
      "Union": "IBT",
      "Union Local": 120,
      "Bargaining Unit Size": "",
      "Lat": 46.97918409,
      "Lng": -96.77604782,
      "City": "Fargo",
      "State": "ND",
      "approx # Employees on strike": 70,
      "Start Date": "10/18/2020",
      "End Date": "",
      "Worker Demands": "Covid Protection",
      "Source": "1. https://apnews.com/article/food-services-fargo-north-dakota-coronavirus-pandemic-strikes-18af8ad97847e128783cd4af6cc3b1c4\n\n2. https://www.kvrr.com/2020/11/18/teamsters-on-strike-against-fargo-food-distributor-over-covid-19-concerns/",
      "Comment": ""
    },
    {
      "Employer": "Johnson Controls",
      "Union": "UAW",
      "Union Local": 1872,
      "Bargaining Unit Size": "",
      "Lat": 39.97636582,
      "Lng": -76.72338861,
      "City": "York",
      "State": "Pennslyvannia",
      "approx # Employees on strike": 44,
      "Start Date": "9/28/2020",
      "End Date": "",
      "Worker Demands": "Pay, Vacation Time",
      "Source": "https://www.ydr.com/story/news/2020/11/13/johnson-controls-workers-strike-pay-increase-vacation-flexibility-york-county-hopewell/6263404002/",
      "Comment": ""
    }
  ]


// Initialize and add the map
function initMap() {
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
      center: { lat: dummyData[0].Lat, lng: dummyData[0].Lng }
  });
  // The marker, positioned at Uluru
  dummyData.forEach((strike,index) => {

    
    
      const marker = new google.maps.Marker({
        position: { lat: strike.Lat, lng: strike.Lng },
        map: map,
        title: strike.City
      });
      
    const card = createCard(strike, marker)
    listDiv.append(card);
      marker.addListener("click", () => {
        createInfoWindow(strike,marker)
      });

  })
}