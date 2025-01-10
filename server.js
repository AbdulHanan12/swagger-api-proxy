require("dotenv").config(); // Load environment variables from .env

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000; // Use PORT from .env or default to 3000

// Middleware to parse JSON requests
app.use(express.json());

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

// Route 4: Handle any other unmatched routes
app.all("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});