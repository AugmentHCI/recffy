const express = require ("express");
const port = 3000;
const app = express();

//const serial = require ("./serial");

app.listen(port, function () {
    console.log("Server listening in port: "+port);
});

app.use(express.static("public"));

//serial.showSerialPorts();
//serial.initializePort();
