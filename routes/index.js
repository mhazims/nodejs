const mqtt = require('mqtt');
const WebSocket = require('ws');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ===== MQTT Configuration (HiveMQ Cloud) =====
const mqttOptions = {
  username: 'otatata',
  password: 'jyHbAUSS37_hpgR',
  protocol: 'wss',
};

const mqttClient = mqtt.connect('wss://c39f18fd98e346cbb96d4081af10c3f5.s1.eu.hivemq.cloud:8884/mqtt', mqttOptions);

mqttClient.on('connect', () => {
  console.log('✅ Connected to HiveMQ');
  mqttClient.subscribe('test/topic', (err) => {
    if (!err) {
      console.log('📡 Subscribed to topic: test/topic');
    }
  });
});

mqttClient.on('message', (topic, message) => {
  console.log(`📥 Received MQTT message: ${message.toString()}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message.toString());
    }
  });
});

// ===== Express & WebSocket Server =====
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Data MQTT Real-time:</h2>
        <ul id="messages"></ul>
        <script>
          const ws = new WebSocket('wss://' + location.host);
          ws.onmessage = (msg) => {
            const li = document.createElement('li');
            li.textContent = msg.data;
            document.getElementById('messages').appendChild(li);
          };
        </script>
      </body>
    </html>
  `);
});
