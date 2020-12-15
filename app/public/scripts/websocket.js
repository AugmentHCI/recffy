const ws = new WebSocket('ws://localhost:8080');

// Connection opened
ws.addEventListener('open', function (event) {
    //ws.send('Hello Server!');
    console.log("Web socket connection for Server");
});

// Listen for messages
ws.addEventListener('message', function (event) {
    console.log('Message received from server: ', event.data);
});

ws.addEventListener('error', function (error) {
    console.log('WebSocket error: ' + error.message);
});

ws.addEventListener('close', function () {
    console.log("WebSocket connection closed");
});