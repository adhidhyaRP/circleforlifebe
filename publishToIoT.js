// publishToIoT.js
const express = require('express');
const cors = require('cors');
const awsIot = require('aws-iot-device-sdk');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

const device = awsIot.device({
  keyPath: "./Certi/private.pem.key",
  certPath: "./Certi/certificate.pem.crt",
  caPath: "./Certi/AmazonRootCA1.pem",
  clientId: "myNodeJsClient",
  host: "a2r1skj9umgl4j-ats.iot.eu-north-1.amazonaws.com"
});

  

const topic = "cycle/data"; // Replace with your IoT Core topic name

device.on('connect', () => {
  console.log('Connected to AWS IoT Core');
});

device.on('error', (error) => {
  console.error('Connection Error:', error);
});

// API endpoint to receive data from frontend
app.post('/sendToIoT', (req, res) => {
  const { cycleID, userID } = req.body;

  const payload = JSON.stringify({ cycleID, userID });

  device.publish(topic, payload, (err) => {
    if (err) {
      console.error("Failed to publish message:", err);
      return res.status(500).send("Failed to publish message");
    }
    console.log(`Message published to topic ${topic}:`, payload);
    res.send("Message sent to AWS IoT Core successfully");
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
