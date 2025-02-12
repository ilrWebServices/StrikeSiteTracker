# IRL Labor Action Tracker

This is the code for https://striketracker.ilr.cornell.edu/.

It is primarily a single page app hosted on Github Pages, but the data is stored in a [Grist](https://www.getgrist.com/) database. There is a build script that transforms the data in the database into a JSON file that is deployed to Pages.

## Overview

- Data is added and edited in a Grist database.
- A build script, run with Github Actions, generates a static copy of this site with the database data in `labor_actions.json` and publishes it to Github Pages.
  - The scheduled workflow may be disabled if there is no repo activity for 60 days. See https://docs.github.com/en/actions/learn-github-actions/usage-limits-billing-and-administration#disabling-and-enabling-workflows

### Deployment Configuration

- `GRIST_API_TOKEN` must be set in the _Secrets and variables_ settings (`settings/secrets/actions`) in the Github project. 

## Local setup

- Copy `.env.example` to `.env` and set the `GRIST_API_TOKEN`.
- Run `npm install`.

## Testing

1. Run `npm run build` to create the `labor_actions.json` file.
2. Open `index.html` in a web browser.

## What's new in 2.0?

- Site loading is much faster. This was done by:
  - Rewriting the javascript
  - Initially limiting the first page load to the labor actions of the last 12 months
- The filter form has been simplified and now includes Employer
- New non-google map with custom markers
- Moved data from Google Sheets to self-hosted Grist instance
  - No more Google Form for adding/editing existing labor actions
  - Relational storage for locations and sources
  - Built-in geocoder that doesn't rely on a paid Google project
- Report a Labor Action form moved to Grist with results next to existing data
  - This could be improved by changing the form and dropping the reports into the main data table
