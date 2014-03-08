# NeuMimic Backend

Simple API for storing / retrieving therapy session results from a networked server.

## Run

- `npm install`
  - Uses node package manager to install dependencies
- `node index.js`
  - Runs server

## API Structure

- `GET /sessions` - returns JSON object of array of stored exercise sessions
- `POST /sessions` - expects JSON object of exercise session and appends to end of session array

For more information on the NeuMimic project, see www.neumimic.com.
