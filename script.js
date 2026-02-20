(function(document) {

  let map = false;
  const actions = new Map();
  const markers = L.markerClusterGroup({ disableClusteringAtZoom: 17 });
  const personIcon = L.icon({
    iconUrl: 'images/person.png',
    shadowUrl: 'images/person-shadow.png',
    iconSize:     [30, 45], // size of the icon
    shadowSize:   [65, 35], // size of the shadow
    iconAnchor:   [10, 45], // point of the icon which will correspond to marker's location
    shadowAnchor: [15, 30],  // the same for the shadow
    popupAnchor:  [14, -23] // point from which the popup should open relative to the iconAnchor
  });
  const form_opts = {
    states: [''],
    industries: [''],
    demands: [
      '',
      'Pay',
      'Health and safety',
      'Staffing',
      'Healthcare',
      'Job Security',
      'First contract',
      'Union recognition',
      'Retirement benefits',
      'Racial justice',
      'Scheduling',
      'End to anti-union retaliation',
    ],
    durations: [
      '',
      '1 day or less',
      '2-7 days',
      '8-30 days',
      '31+ days',
    ],
    participant_counts: [
      '',
      'Less than 100',
      'Between 100 and 199',
      'Between 200 and 299',
      'Between 300 and 499',
      'Between 500 and 1999',
      'Greater than 2000',
    ],
  };
  const {div, p} = van.tags
  const result_count = van.state(0);
  const results_wrapper = div({class: 'results'}, p(() => `${result_count.val} labor actions found.`));

  let processFormTimeoutId = null;
  const processForm = (e) => {
    let form = e.currentTarget;

    if (e.target.type == 'text') {
      window.clearTimeout(processFormTimeoutId);
      processFormTimeoutId = window.setTimeout(() => {
        search(new FormData(form))
      }, 1000);
    }
    else {
      search(new FormData(form))
    }
  };

  const search = (form_data) => {
    const results = new Map();

    for (const [action_id, action] of actions) {
      let conditions = {};

      if (form_data.getAll('action-type').length) {
        conditions.action_type = form_data.getAll('action-type').includes(action.Action_type);
      }

      if (form_data.get('searchstr')) {
        conditions.searchstr = action.Employer.toUpperCase().includes(form_data.get('searchstr').toUpperCase()) || action.Labor_Organization.toUpperCase().includes(form_data.get('searchstr').toUpperCase());
      }

      if (form_data.get('start-date-from')) {
        conditions.state_date_from = action.Start_date >= form_data.get('start-date-from');
      }

      if (form_data.get('start-date-to')) {
        conditions.state_date_to = action.Start_date <= form_data.get('start-date-to');
      }

      if (form_data.get('state')) {
        conditions.state = false;

        for (const location of action.locations) {
          if (location.State.toUpperCase().includes(form_data.get('state').toUpperCase())) {
            conditions.state = true;
            break;
          }
        }
      }

      if (form_data.get('industry')) {
        conditions.industry = action.Industry.includes(form_data.get('industry'));
      }

      if (form_data.getAll('worker-demands').length) {
        // if (action.Worker_demands.some(item => form_data.getAll('worker-demands').includes(item))) {
        //   console.log(form_data.getAll('worker-demands'));
        //   console.log(action.Worker_demands);
        // }
        // This checks to see if the action has _any_ of the selected demands,
        // not all.
        conditions.demands = action.Worker_demands.some(item => form_data.getAll('worker-demands').includes(item));
      }

      if (form_data.get('duration')) {
        conditions.duration = (() => {
          switch (form_data.get('duration')) {
            case '1 day or less':
              return action.Duration && action.Duration <= 1;
            case '2-7 days':
              return action.Duration >= 2 && action.Duration <= 7;
            case '8-30 days':
              return action.Duration >= 8 && action.Duration <= 30;
            case '31+ days':
              return action.Duration >= 31;
            default:
              return false;
          }
        })();
      }

      if (form_data.get('participant-count')) {
        conditions.participant_count = (() => {
          switch (form_data.get('participant-count')) {
            case 'Less than 100':
              return action.Approximate_Number_of_Participants < 100;
            case 'Between 100 and 199':
              return action.Approximate_Number_of_Participants >= 100 && action.Approximate_Number_of_Participants < 200;
            case 'Between 200 and 299':
              return action.Approximate_Number_of_Participants >= 200 && action.Approximate_Number_of_Participants < 300;
            case 'Between 300 and 499':
              return action.Approximate_Number_of_Participants >= 300 && action.Approximate_Number_of_Participants < 500;
            case 'Between 500 and 1999':
              return action.Approximate_Number_of_Participants >= 500 && action.Approximate_Number_of_Participants < 2000;
            case 'Greater than 2000':
              return action.Approximate_Number_of_Participants >= 2000;
            default:
              return false;
          }
        })();
      }

      if (form_data.get('unauthorized')) {
        conditions.authorized = action.Authorized === 'N';
      }

      // Is every condition true?
      if (Object.values(conditions).every(Boolean)) {
        // console.log(conditions);
        results.set(action_id, action);
      }
    }

    markers.clearLayers();
    map.setView([38, -97], 4);

    // Hide all cards.
    for (const [action_id, action] of actions) {
      // action.card.style.display = 'none';
      if (results_wrapper.contains(action.card)) {
        results_wrapper.removeChild(action.card)
      }
    }

    result_count.val = results.size;

    if (results.size) {
      // Scroll to top of results.
      results_wrapper.scrollIntoView();

      for (const [id, result] of results) {
        // Show the action card if it's in the results.
        // result.card.style.display = 'block';
        results_wrapper.appendChild(result.card)

        for (const location of result.locations) {
          // console.log(location.marker);
          markers.addLayer(location.marker);
        }
      }
    }

    return results;
  };

  document.addEventListener('DOMContentLoaded', async (event) => {
    await init();
    const listing_wrapper = document.querySelector('#listing');

    let filter_form = createElementFromTemplate(renderSearchForm());
    filter_form.addEventListener('input', processForm);

    van.add(listing_wrapper, filter_form);
    van.add(listing_wrapper, results_wrapper);

    // Enhance the worker demands multiple select input.
    const enh_select_demands = new SlimSelect({
      select: '#worker-demands',
      events: {
        afterChange: () => {
          filter_form.dispatchEvent(new Event('input'));
        }
      }
    });

    // Reset the enhanced worker demands multple select input when the form is reset.
    filter_form.addEventListener('reset', (event) => {
      enh_select_demands.setSelected();
    });

    // Trigger the input event on the filter form, which will put the cards in
    // the results listing and markers on the map.
    filter_form.dispatchEvent(new Event('input'));

    const dialog_element = document.getElementById('reusable-dialog');
    const dialog_content = dialog_element.querySelector('.content');

    // Add a global document body click handler for event delegation.
    document.body.addEventListener('click', async (event) => {
      if (event.target.matches('.action-card__location')) {
        let action = actions.get(event.target.dataset.action);
        let location = action.locations_map.get(Number(event.target.dataset.id));
        if (!location.marker.isPopupOpen()) {
          zoom(location.marker);

          // Close the results drawer and if open.
          document.querySelector('.menu-toggle input').checked = false;
          document.querySelector('#listing-toggle').checked = false;
        }
      } else if (event.target.closest('.action-card')) {
        // TODO: Fix when viewing popup and clicking on source or selecting text.
        if (event.target.closest('#listing .results .action-card')) {
          event.target.closest('#listing .results .action-card').querySelector('.action-card__location').click();
        }
      } else if (event.target.matches('.content-link')) {
        event.preventDefault();
        const resource = event.target.getAttribute('href');
        const content = await fetchPage(resource);
        dialog_content.innerHTML = content;
        dialog_element.showModal();
      } else if (event.target.matches('#reusable-dialog button')) {
        dialog_element.close();
      }
    });

    // Add a global listener for the escape key and use it to reset the filter
    // form to defaults and trigger an input event to populate the results.
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !dialog_element.open) {
        filter_form.reset();
        filter_form.dispatchEvent(new Event('input'));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        filter_form.dispatchEvent(new Event('input'));
      }
    });

    window.addEventListener('hashchange', () => {
      triggerDialogViaHash();
    });

    // If there's an initial. fragment URL, see of there is a content-link that
    // matches and click it.
    if (window.location.hash) {
      triggerDialogViaHash();
    }
  });

  const init = async () => {
    map = L.map('map').setView([38, -97], 4);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add the markers to the map.
    map.addLayer(markers);

    // Amazingly, we can use the Google Maps tile layer if we want to!
    // L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
    //   maxZoom: 19,
    //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    //   subdomains: ['mt0','mt1','mt2','mt3']
    // }).addTo(map);

    const action_data = await fetchActions();

    // Store all actions in our global actions map.
    for (const [action_id, action] of Object.entries(action_data)) {
      // Make a DOM element for the card and store it alongside the data.
      const action_card = renderActionCard(action);
      action.card = createElementFromTemplate(action_card);

      // action.locations is an array. Make a Map for the locations for easy lookup.
      action.locations_map = new Map();
      actions.set(action_id, action);

      for (const location of action.locations) {
        // Store a marker with the location for easy reference.
        location.marker = L.marker([location.Latitude, location.Longitude], { title: location.City, action: action_id, location: location.id, icon: personIcon });

        // We don't put `action.card` here because it would be the same DOM node
        // and can only be placed in the DOM once.
        location.marker.bindPopup((layer) => renderActionCard(action, location.id), {
          minWidth: 300
        });

        action.locations_map.set(location.id, location);

        form_opts.states.indexOf(location.State) === -1 ? form_opts.states.push(location.State) : null;
        form_opts.states.sort();
      }

      for (const industry of action.Industry) {
        !form_opts.industries.includes(industry) ? form_opts.industries.push(industry) : null;
      }
      form_opts.industries.sort();

      // The worker demands are hardcoded until data cleanup can happen.
      // for (const demand of action.Worker_demands) {
      //   form_opts.demands.indexOf(demand) === -1 ? form_opts.demands.push(demand) : null;
      // }
      // form_opts.demands.sort();
    }

    // console.log(form_opts);
  };

  const zoom = (marker) => {
    map.flyTo(marker.getLatLng(), 17, {duration: 1})
      .on('zoomend', () => {
        marker.openPopup();
      });
  };

  const renderSearchForm = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);

    return `
      <form class="filter-form">
        <label>Action type</label>
        <div class="type-options">
          <label><input name="action-type" type="checkbox" value="Strike" checked> Strike</label>
          <label><input name="action-type" type="checkbox" value="Protest"> Protest</label>
        </div>

        <label for="searchstr">Search</label>
        <input id="searchstr" name="searchstr" type="text" placeholder="Labor organization or employer">

        <label>Start date range</label>
        <div class="date-options">
          <input type="date" aria-label="from" id="start-date-from" name="start-date-from" value="${date.toLocaleDateString('en-CA')}" min="2021-01-01">
          <input type="date" aria-label="to" id="start-date-to" name="start-date-to">
        </div>

        <label for="state">State</label>
        <select id="state" name="state">
          ${form_opts.states.map(state => `<option value="${state}">${state}</option>`).join('')}
        </select>

        <label for="industry">Industry</label>
        <select id="industry" name="industry">
          ${form_opts.industries.map(industry => `<option value="${industry}">${industry}</option>`).join('')}
        </select>

        <label for="worker-demands">Worker demands</label>
        <select id="worker-demands" name="worker-demands" multiple>
          ${form_opts.demands.map(demand => `<option value="${demand}">${demand}</option>`).join('')}
        </select>

        <label for="duration">Duration</label>
        <select id="duration" name="duration">
          ${form_opts.durations.map(duration => `<option value="${duration}">${duration}</option>`).join('')}
        </select>

        <label for="participant-count">Participants</label>
        <select id="participant-count" name="participant-count">
          ${form_opts.participant_counts.map(duration => `<option value="${duration}">${duration}</option>`).join('')}
        </select>

        <label for="unauthorized">Unauthorized?</label>
        <input type="checkbox" id="unauthorized" name="unauthorized" class="authorized-option"/>
      </form>
    `;
  };

  const renderActionCard = (action, location_id = null) => {
    // let start_date = new Date(action.Start_date);
    // let order = Math.floor(start_date.getTime() / 1000) * -1;
    // console.log(location_id);

    // data-type="${action.Action_type}" data-labor-org="${action.Labor_Organization}" data-start="${action.Start_date}" data-end="${action.End_date}" data-states="" data-industry="" data-worker-demands="" data-duration="" data-participant-count="" data-duration="" data-authorized="${action.Authorized}"
    let template = `
      <div class="action-card" style="order: ${action._order}">
        ${action.Employer ? `<div class="action-card__employer"><strong>Employer:</strong> ${action.Employer}</div>` : ''}
        ${action.Labor_Organization ? `<div class="action-card__labor-org"><strong>Labor Organization:</strong> ${action.Labor_Organization}</div>` : ''}
        ${action.Local ? `<div class="action-card__local"><strong>Local:</strong> ${action.Local}</div>` : ''}
        ${action.Industry ? `<div class="action-card__industry"><strong>Industry:</strong> ${action.Industry.join(' • ')}</div>` : ''}
        ${action.Approximate_Number_of_Participants ? `<div class="action-card__participant-count"><strong>Approximate number of participants:</strong> ${action.Approximate_Number_of_Participants}</div>` : ''}
        ${action.Bargaining_Unit_Size ? `<div class="action-card__bargaining-unit-size"><strong>Bargaining unit size:</strong> ${action.Bargaining_Unit_Size}</div>` : ''}
        ${action.Start_date ? `<div class="action-card__start-date"><strong>Start:</strong> ${action.Start_date}</div>` : ''}
        ${action.End_date ? `<div class="action-card__end-date"><strong>End:</strong> ${action.End_date}</div>` : ''}
        ${action.Action_type ? `<div class="action-card__type"><strong>Action type:</strong> ${action.Action_type}</div>` : ''}
        ${action.Duration ? `<div class="action-card__duration"><strong>Duration:</strong> ${action.Duration} day${action.Duration > 1 ? 's' : ''}</div>` : ''}
        ${action.Authorized ? `<div class="action-card__authorized"><strong>Authorized:</strong> ${action.Authorized === 'Y' ? 'Yes' : 'No'}</div>` : ''}
        <div class="action-card__demands"><strong>Worker demands:</strong> ${action.Worker_demands.map(demand => `<span class="action-card__demand">${demand}</span>`).join(' • ')}</div>

        <div class="action-card__location-label"><strong>Location${action.locations.length > 1 ? 's' : ''}:</strong></div>
        ${action.locations.map(location => `<div class="action-card__location" data-id="${location.id}"
data-action="${action.id}" data-current="${location.id === location_id}" title="${location.Address}">${location.City}, ${location.State}</div>`).join('')}

        <div class="action-card__source-label"><strong>Source${action.sources.length > 1 ? 's' : ''}:</strong></div>
        ${action.sources.map((source, index) => `<a href="${source}" target="_blank" title="${source} " class="action-card__source">Source ${index+1}</a>`).join('')}
        ${action.Notes ? `<div class="action-card__notes"><strong>Notes:</strong> ${action.Notes}</div>` : ''}
      </div>
    `;

    return template;
  };

  const createElementFromTemplate = (html) => {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
  };

  const fetchActions = async () => {
    try {
      const response = await fetch('labor_actions.json');
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchPage = async (url) => {
    try {
      const parser = new DOMParser();
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const content = await response.text();
      const page_dom = parser.parseFromString(content, 'text/html');
      return page_dom.getElementById('main').innerHTML;

    } catch (error) {
      console.error(error.message);
    }
  };

  const triggerDialogViaHash = () => {
    const dialog_link = document.querySelector('.content-link[href^="/' + window.location.hash.substring(1) +'"]');

    if (dialog_link) {
      dialog_link.click();
      history.replaceState('', document.title, window.location.pathname + window.location.search);
    }
  };

})(document);
