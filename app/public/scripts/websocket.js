const sliderComedies = document.getElementById("sliderComedies");
const sliderAdventure = document.getElementById("sliderAdventure");
const sliderDrama = document.getElementById("sliderDrama");
const sliderHorror = document.getElementById("sliderHorror");
const sliderRomance = document.getElementById("sliderRomance");

let valueComedies = document.getElementById("valueComedies");
let valueHorrors = document.getElementById("valueHorror");
let valueRomances = document.getElementById("valueRomance");
let valueDramas = document.getElementById("valueDrama");
let valueAdventures = document.getElementById("valueAdventure");

const ws = new WebSocket('ws://localhost:8080');

// Connection opened
ws.addEventListener('open', function (event) {
    console.log("Web socket connection for Server");
});

// Listen for messages
ws.addEventListener('message', function (event) {
    handleMessage(event.data);
});

ws.addEventListener('error', function (error) {
    console.log('WebSocket error: ' + error.message);
});

ws.addEventListener('close', function () {
    console.log("WebSocket connection closed");
});

function handleMessage(message) {
    message = message.replace(/(\r\n|\n|\r)/gm, "");
    console.log('Message received from server: ', message);
    if (message!==""){
        let aux = 0;
        switch (message) {
            case "rd_standby":
                showStandByMessage();
                break;
            case "rd_active":
                hideStandByMessage();
                break;
            case "dislike":
                dislike();
                break;
            case "shake":
                createRandomRecommendations();
                break;
            case "turn_left":
                buttonLeft.onclick();
                break;
            case "turn_right":
                buttonRight.onclick();
                break;
            case "increase_comedy":
                if (sliderComedies.value!=="100"){
                    aux = parseInt(sliderComedies.value);
                    aux += 25;
                    sliderComedies.value=aux.toString();
                    valueComedies.innerHTML = "";
                    valueComedies.innerHTML = sliderComedies.value + "%";
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "decrease_comedy":
                if (sliderComedies.value!=="0"){
                    aux = parseInt(sliderComedies.value);
                    aux -= 25;
                    sliderComedies.value=aux.toString();
                    valueComedies.innerHTML = "";
                    valueComedies.innerHTML = sliderComedies.value + "%";
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "increase_horror":
                if (sliderHorror.value!=="100"){
                    aux = parseInt(sliderHorror.value);
                    aux += 25;
                    sliderHorror.value=aux.toString();
                    valueHorrors.innerHTML = "";
                    valueHorrors.innerHTML = sliderHorror.value + "%";
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "decrease_horror":
                if (sliderHorror.value!=="0"){
                    aux = parseInt(sliderHorror.value);
                    aux -= 25;
                    sliderHorror.value=aux.toString();
                    valueHorrors.innerHTML = "";
                    valueHorrors.innerHTML = sliderHorror.value + "%";
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "increase_romance":
                if (sliderRomance.value!=="100"){
                    aux = parseInt(sliderRomance.value);
                    aux += 25;
                    sliderRomance.value=aux.toString();
                    valueRomances.innerHTML = "";
                    valueRomances.innerHTML = sliderRomance.value + "%";
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "decrease_romance":
                if (sliderRomance.value!=="0"){
                    aux = parseInt(sliderRomance.value);
                    aux -= 25;
                    sliderRomance.value=aux.toString();
                    valueRomances.innerHTML = "";
                    valueRomances.innerHTML = sliderRomance.value + "%";
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "decrease_drama":
                if (sliderDrama.value!=="0"){
                    aux = parseInt(sliderDrama.value);
                    aux -= 25;
                    sliderDrama.value=aux.toString();
                    valueDramas.innerHTML = "";
                    valueDramas.innerHTML = sliderDrama.value + "%";
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "increase_drama":
                if (sliderDrama.value!=="100"){
                    aux = parseInt(sliderDrama.value);
                    aux += 25;
                    sliderDrama.value=aux.toString();
                    valueDramas.innerHTML = "";
                    valueDramas.innerHTML = sliderDrama.value + "%";
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "increase_adventure":
                if (sliderAdventure.value!=="100"){
                    aux = parseInt(sliderAdventure.value);
                    aux += 25;
                    sliderAdventure.value=aux.toString();
                    valueAdventures.innerHTML = "";
                    valueAdventures.innerHTML = sliderAdventure.value + "%";
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "decrease_adventure":
                if (sliderAdventure.value!=="0"){
                    aux = parseInt(sliderAdventure.value);
                    aux -= 25;
                    sliderAdventure.value=aux.toString();
                    valueAdventures.innerHTML = "";
                    valueAdventures.innerHTML = sliderAdventure.value + "%";
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "explanation":
                showMovieExplanation();
                break;
            case "play":
                playMovie();
                break;
            default:
                break;
        }
    }
}