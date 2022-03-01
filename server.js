// server.js

// load express as a deoendency
const express = require('express');

// Define Express App
const app = express();


// Define the server host IP and port
const HOST = '127.0.0.1';

// if port defined in ENV, use that value, otherwise use 3000
const PORT = process.env.PORT || 3000;

// Serve website from the public folder
// This will look for an HTML doc named index.html
app.use(express.static('public'));

// Start the server and listen for requests
app.listen(PORT, HOST, () => {
  console.log(`Server connected at http://${HOST}:${PORT}\n\n`);
  console.log('\x1b[44m%s\x1b[0m', `Open http://localhost:${PORT} in your web browser to load index.html from the public folder`);
});
