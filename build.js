require('dotenv').config();
const fs = require("fs");
const readline = require("readline");
const core = require("@actions/core");
const { google } = require("googleapis");
const convertRowsToJson = require("./convertRowsToJson");
// const console = {}
// console.log = () => {}
const findLatLng = require("./findLatLng");
const updateLatLngInSheets = require("./updateLatLngInSheets");
// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";
const spreadsheetId = "1NuTrust5-tFaslvbiqoL4Xvr8Wvq4nyXYta3vo4-B4Y";
// Load client secrets from a local file.
fs.readFile("credentials.json", "utf8", (err, content) => {
  if (err) {
    try {
      content = JSON.parse(process.env.SHEETS_CRED);
    } catch (error) {
      console.error(error);
    }
  }
  if (typeof content === "string") {
    content = JSON.parse(content);
  }

  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(content, listMajors);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, "utf8", (err, token) => {
    if (err) {
      token = JSON.parse(process.env.SHEETS_TOKEN);
    }
    if (typeof token === "string") {
      token = JSON.parse(token);
    }
    oAuth2Client.setCredentials(token);
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function listMajors(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: spreadsheetId,
      range: "A1:AZ4000",
    },
    async (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      // console.log(res,'<---------------res')
      const rows = res.data.values;
      if (rows.length) {
        const objectArray = convertRowsToJson(rows);
        // console.log(objectArray.length,'<-------------------------objectArray.length')
        const geoCodeArray = await findLatLng(objectArray);
        // const updatedGeocodeArray = await updateLatLngInSheets(
        //   geoCodeArray,
        //   spreadsheetId,
        //   auth
        // );
        console.log('Creating File')
        fs.writeFileSync(
          "geodata.js",
          `window.geodata=${JSON.stringify(geoCodeArray)}`
        );
      } else {
        console.log("No data found.");
      }
    }
  );
}
