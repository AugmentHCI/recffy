const sliderComedies = document.getElementById("sliderComedies");
const sliderAdventure = document.getElementById("sliderAdventure");
const sliderDrama = document.getElementById("sliderDrama");
const sliderHorror = document.getElementById("sliderHorror");
const sliderRomance = document.getElementById("sliderRomance");

let valueComedies = document.getElementById("valueComedies");
let valueAdventures = document.getElementById("valueHorror");
let valueDramas = document.getElementById("valueRomance");
let valueHorrors = document.getElementById("valueDrama");
let valueRomances = document.getElementById("valueAdventure");

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

function handleMessage(message) {
    if (message!=="rd_standby"){
        switch (message) {
            case "dislike":
                dislike();
                break;
            case "shake":
                createRandomRecommendations()
                break;
            case "turn_left":
                buttonLeft.onclick();
                break;
            case "turn_right":
                buttonRight.onclick();
                break;
            case "increase_comedy":
                if (sliderComedies.val()!==100){
                    sliderComedies.val+=25;
                    valueComedies.html(sliderComedies.val()+"%");
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "decrease_comedy":
                if (sliderComedies.val()!==0){
                    sliderComedies.val-=25;
                    valueComedies.html(sliderComedies.val()+"%");
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "increase_horror":
                if (sliderHorror.val()!==100){
                    sliderHorror.val+=25;
                    valueHorrors.html(sliderHorror.val()+"%");
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "decrease_horror":
                if (sliderHorror.val()!==0){
                    sliderHorror.val-=25;
                    valueHorrors.html(sliderHorror.val()+"%");
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "increase_romance":
                if (sliderRomance.val()!==100){
                    sliderRomance.val+=25;
                    valueRomances.html(sliderRomance.val()+"%");
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "decrease_romance":
                if (sliderRomance.val()!==0){
                    sliderRomance.val-=25;
                    valueRomances.html(sliderRomance.val()+"%");
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "decrease_drama":
                if (sliderDrama.val()!==0){
                    sliderDrama.val-=25;
                    valueDramas.html(sliderDrama.val()+"%");
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "increase_drama":
                if (sliderDrama.val()!==100){
                    sliderDrama.val+=25;
                    valueDramas.html(sliderDrama.val()+"%");
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "increase_adventure":
                if (sliderAdventure.val()!==100){
                    sliderAdventure.val+=25;
                    valueDramas.html(sliderAdventure.val()+"%");
                    setTimeout(createRecommendations(),2000);
                }
                break;
            case "decrease_adventure":
                if (sliderAdventure.val()!==0){
                    sliderAdventure.val-=25;
                    valueDramas.html(sliderAdventure.val()+"%");
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
    else{
        showStandByMessage();
    }
}