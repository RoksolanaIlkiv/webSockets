const express = require("express");
const WebSocket = require("ws");
const app = express();
const port = 3000;

// Initialize WebSocket server
const wsWebSocket = new WebSocket.Server({ port: 8080 });

// WebSocket event handling
wsWebSocket.on("connection", (ws) => {
  console.log("A new client connected.");

  // Event listener for incoming messages
  ws.on("message", (message) => {
    console.log("Received message:", message.toString());

    // Broadcast the message to all connected clients
    wsWebSocket.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  // Event listener for client disconnection
  ws.on("close", () => {
    console.log("A client disconnected.");
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
