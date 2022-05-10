# IRL Labor Action Tracker

This is the code for https://striketracker.ilr.cornell.edu/.

It is primarily a single page app hosted on Github Pages, but the data is stored in a Google spreadsheet and input via a Google form. There is an Apps Script on the form that geocodes addresses, and a build script that transforms the data in the spreadsheet into a JSON file that is deployed to Pages.

## Overview

- Data is entered via a Google Form
  https://docs.google.com/forms/d/1CbzRbAhROop6pK07x3Q_YZ371FofGpuaBpJEDcj8s74/edit
- Data is stored in a Google Sheet
  https://docs.google.com/spreadsheets/d/1NuTrust5-tFaslvbiqoL4Xvr8Wvq4nyXYta3vo4-B4Y/edit#gid=1958885101
- An App Script is attached (?) to the form
  https://script.google.com/home/projects/1IZo_W35EoGQ7eRMcCvqcg248pAO5HI9TOnzAG3oc1BsS3E2Godf1elpD/edit
  - Some of the geocoding smarts are here.
- A build script, along with Github Actions, generates a static copy of this site with all the spreadsheet data in `geodata.js` and publishes it to Github Pages.
  - As of 2022, the scheduled workflow can be disabled if there is no repo activity for 60 days. See https://docs.github.com/en/actions/learn-github-actions/usage-limits-billing-and-administration#disabling-and-enabling-workflows

### Deployment Configuration

- There's a Google Cloud Platform (GCP) project called `ilr-strike-tracker-geocoding` that enables the followning services:
  - Geocoding API
  - Google Sheets API
- Under APIs and Services > Oauth consent screen in the GCP project, `ilrstriketracker@gmail.com` was added as a test user.
- Geocoding API requires billing info, so a credit card is attached to that project.

## Local setup

- Go to [API Console](https://console.cloud.google.com/apis/dashboard?project=ilr-strike-tracker-geocoding) as user `ilrstriketracker@gmail.com`
- Ensure that 'Google Sheets API' is enabled. (Jeff did this on 5/10/22).
- Under 'Credentials', download the 'Build script' as JSON to `credentials.json`.
- Run `node access-sheets.js`.
- Go to the URL shown after `Authorize this app by visiting this url:`
- Authenticate as `ilrstriketracker@gmail.com` and continue even though we're in test mode.
- Upon successful authentication, the returned page may be a 404. Copy the value of the `code` URL parameter and paste in the terminal at the `Enter the code from that page here:` prompt.
- `token.js` file should be created.

## Testing

1. Create the `geodata.js` file from the spreadsheet data.

```
npm run build
```

2. Open `index.html` in a web browser.
