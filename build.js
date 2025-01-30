require('dotenv').config();
const fs = require("fs");

async function main() {
  const data = new Map();
  const source_data = new Map();
  const sources = await apiSql('select Action, Url from Sources');

  for (let source of sources) {
    const action_id = source.fields.Action;

    if (!source_data.has(action_id)) {
      source_data.set(action_id, []);
    }

    source_data.get(action_id).push(source.fields.Url);
  }

  const locations = await apiSql(`
    select l.id, l.Action, l.Latitude, l.Longitude, l.Address, l.City, l.State,
      a.Employer, a.Labor_Organization, date(a.Start_date, 'unixepoch') as Start_date, date(a.End_date, 'unixepoch') as End_date, a.Authorized, a.Action_type, a.Industry, a.Worker_demands, a.Local, a.Duration, a.Approximate_Number_of_Participants, a.Bargaining_Unit_Size, a.Notes
    from Locations l inner join Actions a on a.id = l.Action
    where a.Display = 1
    order by a.Start_date desc
    --limit 10
  `);

  // console.log(locations);

  // Store all locations, grouped into actions, in the actions map.
  for (let location of locations) {
    const action_id = location.fields.Action;

    if (!data.has(action_id)) {
      data.set(action_id, {
        id: location.fields.Action,
        Employer: location.fields.Employer,
        Start_date: location.fields.Start_date,
        End_date: location.fields.End_date,
        Labor_Organization: location.fields.Labor_Organization,
        Authorized: location.fields.Authorized,
        Action_type: location.fields.Action_type,
        Industry: location.fields.Industry ? JSON.parse(location.fields.Industry) : [],
        Worker_demands: location.fields.Worker_demands ? JSON.parse(location.fields.Worker_demands) : [],
        Local: location.fields.Local,
        Duration: location.fields.Duration,
        Approximate_Number_of_Participants: location.fields.Approximate_Number_of_Participants,
        Bargaining_Unit_Size: location.fields.Bargaining_Unit_Size,
        Notes: location.fields.Notes,
        locations: [],
        sources: source_data.has(action_id) ? source_data.get(action_id) : []
      });
    }

    data.get(action_id).locations.push({
      id: location.fields.id,
      Latitude: location.fields.Latitude,
      Longitude: location.fields.Longitude,
      Address: location.fields.Address,
      City: location.fields.City,
      State: location.fields.State
    });
  }

  // Write the data to a json file.
  fs.writeFileSync('labor_actions.json', JSON.stringify(Object.fromEntries(data)));
  console.log(`Wrote ${locations.length} locations in ${data.size} labor actions to locations.json`);
}

let apiSql = async function(sql, args = []) {
  // const url = "https://api.striketracker.ilr.cornell.edu/docs/t55TDwkP4gQ31erxfQNkU1/sql";
  const url = "https://sheets.app.ilr.cornell.edu/api/docs/t55TDwkP4gQ31erxfQNkU1/sql";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + process.env.GRIST_API_TOKEN
    },
    body: JSON.stringify({
      "sql": sql,
      "args": args,
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

main();
