require("dotenv").config(); // Load environment variables from .env

const express = require("express");
// const serverless = require("serverless-http"); // Netlify serverless wrapper
const axios = require('axios'); // Include axios for API requests
const cors = require('cors'); // CORS middleware
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
const PORT = process.env.PORT || 3000; // Use PORT from .env or default to 3000

// Route 1: Handle GET requests for API 1
app.get("/api1", (req, res) => {
  res.json({ message: "This is API 1 response" });
});

// Route 2: Handle POST requests for API 2
app.post("/api2", (req, res) => {
  const data = req.body;
  res.json({ message: "This is API 2 response", receivedData: data });
});

// Route 3: Handle dynamic routes (e.g., API 3 with a parameter)
app.get("/api3/:param", (req, res) => {
  const param = req.params.param;
  res.json({ message: 'This is API 3 response for param: ', param });
});

// Environment-sensitive route
app.get("/secure", (req, res) => {
  const apiKey = process.env.API_KEY;
  res.json({ message: "Secure route accessed", apiKey });
});

// Route 5: /search-company
app.post("/search-company", (req, res) => {
  const { name, offset } = req.body; // Destructure name and offset from the request body

  let data = JSON.stringify({
    "offset": offset || 30, // Default to 30 if offset is not provided
    "name": name || "KPMG"   // Default to "KPMG" if name is not provided
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://www.zefix.admin.ch/ZefixPublicREST/api/v1/company/search',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': process.env.AUTHORIZATION_KEY, // Store the authorization key in your .env
      // 'Cookie': process.env.COOKIE // Store cookies in your .env
    },
    data : data
  };

  axios.request(config)
    .then((response) => {
         // Set CORS headers for the response
    res.set('Access-Control-Allow-Origin', '*');  // Allow all domains
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');  // Allowed methods
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // Allowed headers
      res.json(response.data); // Send the response data back to the client
    })
    .catch((error) => {
      res.status(500).json({ errorr: error }); // Handle errors and send them as response
    });
});

// Route 4: Handle any other unmatched routes
app.all("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
