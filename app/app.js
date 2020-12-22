const express = require ("express");
const SerialPort = require('serialport');// required for serial port
const WebSocket = require('ws');

const app = express();

const portSerialName = "COM9"; //change for the needed port

const portWeb = process.env.PORT || 3000;

// const wss = new WebSocket.Server({
//     port: 8080,
// });

// wss.on('connection', function connection(ws) {
//     console.log("New client connected by WebSocket");
//     ws.send("Welcome new client! Accepted your WebSocket connection");
//
//     let mySerial = new SerialPort(portSerialName, 9600); //open the port using new()
//
//     mySerial.on('open', function () {
//         console.log('SerialPort open in ' + portSerialName + '. Data rate: ' + mySerial.baudRate);
//     });
//
//     mySerial.on('data', function (data) {
//         let message = data.toString();
//         console.log("Receiving from SerialPort: " + message);
//         ws.send(message);
//     });
//
//     mySerial.on('error', function (error) {
//         console.log('Serial port error: ' + error.message);
//     });
// });

app.listen(portWeb, function () {
    console.log("Server listening in port: " + portWeb);
});

app.use(express.static("public"));

