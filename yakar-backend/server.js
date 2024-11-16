const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const db = require('./config/db');
const cors = require('cors');
const SerialPort = require('serialport'); // Pour la communication série avec l'Arduino
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const userRoutes = require('./routes/user');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json()); // Middleware pour parser le JSON
// Configuration du port série pour recevoir les données de l'Arduino
//const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 }); 

// Recevoir les données de l'Arduino
// port.on('data', (data) => {
//   console.log('Données reçues de l\'Arduino: ' + data.toString());
//   io.emit('codeSecret', data.toString()); // Émettre les données reçues au client via Socket.IO
// });

// Gestion des connexions Socket.IO
// io.on('connection', (socket) => {
//   console.log('Utilisateur connecté via Socket.IO');
  
//   socket.on('loginCode', (data, callback) => {
//     // Traiter le code secret reçu
//     const receivedCode = data.code;
//     const expectedCode = "1234"; // Le code attendu

//     if (receivedCode === expectedCode) {
//       callback({ success: true, role: 'admin' });
//     } else {
//       callback({ success: false });
//     }
//   });
// });

app.use('/api/users', userRoutes); // Route d'enregistrement de l'utilisateur

server.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
