const express = require ("express");
const SerialPort = require('serialport');// required for serial port

const app = express();

const portSerialName = "COM9"; //change for the needed port

const portWeb = process.env.PORT || 3000;

let mySerial = new SerialPort(portSerialName, 9600); //open the port using new()

mySerial.on('open', function () {
    console.log('***port is open in ' + portSerialName + '. Data rate: ' + mySerial.baudRate +'***');
});

mySerial.on('data', function (data) {
    console.log(data.toString());
});

mySerial.on('close', function () {
    console.log('port ' + portName + ' closed.');
});

mySerial.on('error', function () {
    console.log('Serial port error: ' + error.message);
});

app.listen(portWeb, function () {
    console.log("Server listening in port: "+portWeb);
});

app.use(express.static("public"));

