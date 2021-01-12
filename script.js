

function convertLatLngStringToObj(LatLngString) {
  const array = LatLngString.split(',');
  return {
    lat: Number(array[0]),lng:Number(array[1])
  }
}
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
    new MarkerClusterer(map, markerArray, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });

  })
}