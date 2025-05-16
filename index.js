// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

app.use(cors({ origin: '*'}));

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/save', (req, res) => {
  const filePath = path.join(__dirname, 'test.json');

  // Read existing data
  fs.readFile(filePath, 'utf8', (err, data) => {
    let jsonData = [];

    if (!err && data.trim()) {
      try {
        jsonData = JSON.parse(data);
      } catch (parseErr) {
        console.error('Invalid JSON in file.');
        return res.status(500).send('Corrupted data file');
      }
    }

    jsonData.push(req.body);

    // Save updated array back to file
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        return res.status(500).send('Error writing to file');
      }
      res.send(req.body);
    });
  });
});




// Start server
app.listen(3000, () => {
  console.log('Server running at https://saveloctest.netlify.app:3000');
});
