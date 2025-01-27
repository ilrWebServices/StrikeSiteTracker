(function(document) {

  let map = false;
  let actions = new Map();
  const {a, div, li, p, ul, strong, span, form, input, label} = van.tags

  let processForm = function(e) {
    console.log(e);
  };

  document.addEventListener("DOMContentLoaded", async (event) => {
    await init();
    const results_wrapper = div({class: 'results'});
    const listing_wrapper = document.querySelector('#listing');

    let filter_form = form({class: 'form', oninput: e => processForm(e), onkeyup: e => processForm(e)},
      div('Action type',
        label({for: 'action-type-strike'}, 'Strike'),
        input({id: 'action-type-strike', name: 'action-type', type: 'checkbox'}),
        label({for: 'action-type-protest'}, 'Protest'),
        input({id: 'action-type-protest', name: 'action-type', type: 'checkbox'}),
      ),
      label({for: 'labor-org'}, 'Labor organization'),
      input({id: 'labor-org', name: 'labor-org', type: 'text'}),
      label({for: 'state'}, 'State'),
      input({id: 'state', name: 'state', type: 'text'}),
    );

    van.add(listing_wrapper, filter_form);
    van.add(listing_wrapper, results_wrapper);


    // Put the cards on the page?
    for (const [action_id, action] of actions) {
      van.add(results_wrapper, action.card);
    }

    // const minMaxDateObj = await apiSql("SELECT DATE(MIN(Start_Date), 'unixepoch') as fromDate, DATE(MAX(Start_Date), 'unixepoch') as endDate from Actions where Start_Date != ''");
  });

  let init = async function() {
    map = L.map('map').setView([38, -97], 4);
    // map = L.map('map').setView([39.7427825897816, -101.69676383031963], 4);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const markers = L.markerClusterGroup({ disableClusteringAtZoom: 17 });

    const locations = await apiSql("select l.id, l.Action, a.Employer, a.Labor_Organization, date(a.Start_date, 'unixepoch') as Start_date, date(a.End_date, 'unixepoch') as End_date, a.Authorized, a.Action_type, l.Latitude, l.Longitude, l.City from Locations l inner join Actions a on a.id = l.Action where a.Display = 1 order by a.Start_date desc");

    // Store all locations, grouped into actions, in our global actions map.
    for (let location of locations) {
      const action_id = location.fields.Action;
      const marker = L.marker([location.fields.Latitude, location.fields.Longitude], { title: location.fields.City, action: action_id, location: location.fields.id });

      if (!actions.has(action_id)) {
        actions.set(action_id, {
          Action: location.fields.Action,
          Employer: location.fields.Employer,
          Start_date: location.fields.Start_date,
          End_date: location.fields.End_date,
          Labor_Organization: location.fields.Labor_Organization,
          Authorized: location.fields.Authorized,
          Action_type: location.fields.Action_type,
          locations: new Map()
          // full: false
        });
      }

      // marker.bindPopup(renderMarkerPopup(actions.get(action_id)));
      markers.addLayer(marker);

      actions.get(action_id).locations.set(location.fields.id, {
        id: location.fields.id,
        Latitude: location.fields.Latitude,
        Longitude: location.fields.Longitude,
        City: location.fields.City,
        marker: marker,
      });
    }

    // Add the markers to the map.
    map.addLayer(markers);

    // Add a card to each action.
    for (const [action_id, action] of actions) {
      action.card = div({class: 'action-card'});
      // const card = div({class: 'action-card', onclick: e => console.log(e.target)});

      // console.log(action);
      action.card.appendChild(div({class: 'action-card__start-date'},
        strong('From: '), action.Start_date
      ));

      // TODO: Why no empty dates?
      if (action.End_date) {
        action.card.appendChild(div({class: 'action-card__end-date'},
          strong('To: '), action.End_date
        ));
      }

      if (action.Employer) {
        action.card.appendChild(div({class: 'action-card__employer'},
          strong('Employer: '), action.Employer
        ));
      }

      if (action.Labor_Organization) {
        action.card.appendChild(div({class: 'action-card__labor-org'},
          strong('Labor Organization: '), action.Labor_Organization
        ));
      }

      for (const [location_id, location] of action.locations) {
        // console.log(location);
        action.card.appendChild(
          div({class: 'action-card__location', 'data-id': location.id, 'data-action': location.Action, onclick: e => zoom(e, location.marker, action.card)}, location.City)
        );

        location.marker.bindPopup(action.card);
      }
    }
  };

  let zoom = function(e, marker, card) {
    map.flyTo(marker.getLatLng(), 17, {duration: 1})
    .on('zoomend', () => {
        // TODO: Deal with the issue that the card is removed from the results when it's moved into that popup.
        marker.setPopupContent(card);
        marker.openPopup();
      });
  };

  // let renderMarkerPopup = function(e) {
  let renderMarkerPopup = function(action) {
    // console.log(e);
    // console.log(this);
    // let action = actions.get(this.options.action);

    let template = `
      <div class="action-location">
        ${action.Employer ? `<div><strong>Employer:</strong> ${action.Employer}</div>` : ''}
        ${action.Labor_Organization ? `<div><strong>Labor Organization:</strong> ${action.Labor_Organization}</div>` : ''}
        ${action.Local ? `<div><strong>Local:</strong> ${action.Local}</div>` : ''}
        ${action.Start_date ? `<div><strong>Start date:</strong> ${action.Start_date}</div>` : ''}
        ${action.End_date ? `<div><strong>End date:</strong> ${action.End_date}</div>` : ''}
        ${action.Action_type ? `<div><strong>Action type:</strong> ${action.Action_type}</div>` : ''}
      </div>
    `;

    // this.setPopupContent(template);
    return template;
  };

  let apiSql = async function(sql) {
    const url = "https://api.striketracker.ilr.cornell.edu/docs/t55TDwkP4gQ31erxfQNkU1/sql";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "sql": sql,
        "timeout": 500
      }),
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      return json.records;

    } catch (error) {
      console.error(error.message);
    }
  }

})(document);
