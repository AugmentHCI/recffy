const SerialPort = require('serialport');// include the library


const Readline = SerialPort.parsers.Readline; // make instance of Readline parser
const parser = new Readline(); // make a new parser to read ASCII lines

function showSerialPorts(){// list serial ports:
    console.log("Current ports available:");
    SerialPort.list().then(ports => {
        ports.forEach(function(port) {
            console.log(port.path);
            // console.log("Port PnpId: " + port.pnpId);
            // console.log("Port manufacturer: " +port.manufacturer);
        });
    });
}

function initializePort(io){ //starts the connection with the serial port
    let portName = "COM3"; //change for the needed port
    let myPort = new SerialPort(portName, 9600); //open the port using new()
    //for reading every break line \n comming from the serial port, generates a data event every \n
    myPort.pipe(parser); // pipe the serial stream to the parser

    //assign methods to the port

    myPort.on('open', showPortOpen);
    parser.on('data', readSerialData);
    myPort.on('close', showPortClose);
    myPort.on('error', showError);

    function showPortOpen() {
        console.log('port is open in ' + portName + '. Data rate: ' + myPort.baudRate);
    }

    function readSerialData(data) {
        console.log(data.toString());
        io.emit("message",{
            value:data.toString()
        });
    }

    function showPortClose() {
        console.log('port ' + portName + ' closed.');
    }

    function showError(error) {
        console.log('Serial port error: ' + error.message);
    }

}

module.exports.showSerialPorts = showSerialPorts;
module.exports.initializePort = initializePort;