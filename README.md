# IRL Labor Action Tracker

This is the code for https://striketracker.ilr.cornell.edu/.

It is primarily a single page app hosted on Github Pages, but the data is stored in a Google spreadsheet and input via a Google form. There is an Apps Script on the form that geocodes addresses, and a build script that transforms the data in the spreadsheet into a JSON file that is deployed to Pages.
