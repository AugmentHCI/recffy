const api_key = "f6e86a545df19d917c415a89c7adffb8";
const posterbaseURL = "http://image.tmdb.org/t/p/original/";
const tmdbAPIbaseURL = "https://api.themoviedb.org/3/movie/";

const firstMovieId=399055; // The Shape of Water
const secondMovieId=496243; // Parasite

const TMDBgenres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
];

let currentSelectedMovieId = -1;
let limitleft = -1;
let limitRight = -1;

const container = document.getElementById("listOfMovies");
const buttonRight = document.getElementById("navRight");
const buttonLeft = document.getElementById("navLeft");

const $sliderComedies = $('#sliderComedies');
const $sliderAdventure = $('#sliderAdventure');
const $sliderDrama = $('#sliderDrama');
const $sliderHorror = $('#sliderHorror');
const $sliderRomance = $('#sliderRomance');

let moviesAverageWidth = 0;

let movieListRecSys = []; //all recommended movies
let finalListOfRecommendedMovies = []; //Final list of 20 recommended movies shown to the user

let countHeight = 0;

$(document).ready(function () {
    setSlidersAndButtonsForRecs();
    loadRecommendedMovies();
});

function loadRecommendedMovies() {
    let firstMovieRecs = [], secondMovieRecs = [], thirdMovieRecs = [], fourthMovieRecs = [];
    getRecommendedMoviesBasedOnMovie(firstMovieId, 1, function (result) {
        firstMovieRecs = assignExplanation(result.results,"The Shape of Water");
        getRecommendedMoviesBasedOnMovie(secondMovieId, 1, function (result) {
            secondMovieRecs = assignExplanation(result.results,"Parasite");
            getRecommendedMoviesBasedOnMovie(firstMovieId, 2, function (result) {
                thirdMovieRecs = assignExplanation(result.results,"The Shape of Water");
                getRecommendedMoviesBasedOnMovie(secondMovieId, 2, function (result) {
                    fourthMovieRecs = assignExplanation(result.results,"Parasite");
                    let listOfAllRecommendations = firstMovieRecs.concat(secondMovieRecs, thirdMovieRecs,fourthMovieRecs);
                    eraseRepeatedMovies(listOfAllRecommendations, firstMovieId, secondMovieId);
                    randomizeMovies(listOfAllRecommendations);
                    setMovieList(listOfAllRecommendations);
                    createRecommendations();
                });
            });
        });
    });
}

function assignExplanation(listOfMovies, movieExplanation) {
    for (let i=0;i<listOfMovies.length;i++){
        listOfMovies[i].movieExplanation = "Recommended because you liked <strong class='text-uppercase'>" + movieExplanation + "</strong>";
    }
    return listOfMovies;
}

function eraseRepeatedMovies(movieList, firstId, secondId) {
    for (let i=0;i<movieList.length;i++){
        let firstMovie = movieList[i];
        for (let j = i+1;j<movieList.length;j++){
            let secondMovie = movieList[j];
            while ((j<movieList.length)&&(firstMovie.id===secondMovie.id)){
                movieList.splice(j,1);
                secondMovie = movieList[j];
            }
        }
    }
    for (let i=0;i<movieList.length;i++){
        while ((movieList[i].id===(firstId))||(movieList[i].id===(secondId))){
            movieList.splice(i,1);
        }
    }
}

function randomizeMovies(listOfMovies) {
    var position = listOfMovies.length, value, randomPosition;
    while (0 !== position) {
        randomPosition = Math.floor(Math.random() * position);
        position -= 1;
        value = listOfMovies[position];
        listOfMovies[position] = listOfMovies[randomPosition];
        listOfMovies[randomPosition] = value;
    }
}

function setMovieList(movies) {
    movieListRecSys = movies;
}

function createRecommendations() {
    let amountJoy = obtainAmountofMoviesByGenderFromControls(35),
        amountScariness = obtainAmountofMoviesByGenderFromControls(27),
        amountLoving = obtainAmountofMoviesByGenderFromControls(10749),
        amountPensive = obtainAmountofMoviesByGenderFromControls(18),
        amountAmusement = obtainAmountofMoviesByGenderFromControls(12);
    let listof20RecommendedMovies = [];
    if (amountJoy + amountScariness + amountLoving + amountPensive + amountAmusement <= 0){
        fillRandomRecommendations(listof20RecommendedMovies);
    }
    else{
        obtainMoviesByGenderFromTheListOfMovies(listof20RecommendedMovies,amountJoy,"JOY");
        obtainMoviesByGenderFromTheListOfMovies(listof20RecommendedMovies,amountScariness,"SCARINESS");
        obtainMoviesByGenderFromTheListOfMovies(listof20RecommendedMovies,amountLoving,"LOVING");
        obtainMoviesByGenderFromTheListOfMovies(listof20RecommendedMovies,amountPensive,"PENSIVE");
        obtainMoviesByGenderFromTheListOfMovies(listof20RecommendedMovies,amountAmusement,"AMUSEMENT");
        if (listof20RecommendedMovies.length<20){
            fillRandomRecommendationsToAchieve20(listof20RecommendedMovies);
        }
    }
    listof20RecommendedMovies.sort(orderByRating);
    setFinalListOfRecommendedMovies(listof20RecommendedMovies);
    setGenresAmountForSliders();
    displayRecommendedMovies(finalListOfRecommendedMovies);
    //setMovieCardsHeight();
}

function obtainAmountofMoviesByGenderFromControls(genre) {
    let amount = 0;
    let sum = parseInt($sliderComedies.val()) + parseInt($sliderHorror.val()) + parseInt($sliderRomance.val()) + parseInt($sliderAdventure.val()) + parseInt($sliderDrama.val());
    switch (genre) {
        case 35:
            amount = $sliderComedies.val();
            break;
        case 27:
            amount = $sliderHorror.val();
            break;
        case 10749:
            amount = $sliderRomance.val();
            break;
        case 12:
            amount = $sliderAdventure.val();
            break;
        case 18:
            amount = $sliderDrama.val();
            break;
        default:
            break;
    }
    return Math.floor(20*(amount/sum));
}

function obtainMoviesByGenderFromTheListOfMovies(list,number,genre) {
    let genresList = obtainNeededGenres(genre);
    if (number>0){
        for (let i=0;i<movieListRecSys.length;i++){
            if ((movieListRecSys[i].genre_ids.some(id=>genresList.includes(id)))&&(number>0)&&(!list.includes(movieListRecSys[i]))){
                movieListRecSys[i].mainGenre = genre;
                list.push(movieListRecSys[i]);
                number--;
            }
            if (number===0){
                break;
            }
        }
        while (number>0){
            let randomNumber = Math.floor(Math.random() * movieListRecSys.length);
            let randomMovie = movieListRecSys[randomNumber];
            if (!list.includes(randomMovie)){
                randomMovie.mainGenre = "RANDOM";
                randomMovie.movieExplanation = "Recommended ramdonly due to a lack of movies for " + genre + " in your personalized recommendations";
                list.push(randomMovie);
                number--;
            }
        }
    }
}

function obtainNeededGenres(genre) {
    let listOfNeededGenres = [];
    switch (genre) {
        case "JOY":
            listOfNeededGenres = [16,35,10751,14,10402];
            break;
        case "SCARINESS":
            listOfNeededGenres = [80,27,9648,53];
            break;
        case "LOVING":
            listOfNeededGenres = [10749];
            break;
        case "PENSIVE":
            listOfNeededGenres = [99,18,36];
            break;
        case "AMUSEMENT":
            listOfNeededGenres = [28,12,878,10752,37];
            break;
    }
    return listOfNeededGenres;
}

function fillRandomRecommendations(listOfMovies) {
    while (listOfMovies.length<20){
        let randomNumber = Math.floor(Math.random() * movieListRecSys.length);
        let randomMovie = movieListRecSys[randomNumber];
        if (!listOfMovies.includes(randomMovie)){
            randomMovie.mainGenre = "RANDOM";
            listOfMovies.push(randomMovie);
        }
    }
}

function fillRandomRecommendationsToAchieve20(listOfMovies) {
    while (listOfMovies.length<20){
        let randomNumber = Math.floor(Math.random() * movieListRecSys.length);
        let randomMovie = movieListRecSys[randomNumber];
        if (!listOfMovies.includes(randomMovie)){
            randomMovie.mainGenre = "RANDOM";
            randomMovie.movieExplanation = "Recommended randomly to fulfill 20 movies in total";
            listOfMovies.push(randomMovie);
        }
    }
}

function orderByRating(movie1,movie2){
    if (movie2.vote_average<movie1.vote_average){
        return -1;
    }
    if(movie2.vote_average>=movie1.vote_average){
        return 1;
    }
    return 0;
}

function setGenresAmountForSliders() {
    let amountComedies = 0, amountHorrors = 0, amountRomances = 0, amountDramas = 0, amountAdventures = 0, amountRandom = 0;
    for (let i=0;i<finalListOfRecommendedMovies.length;i++){
        if (finalListOfRecommendedMovies[i].mainGenre === "JOY"){
            amountComedies++;
        }
        if (finalListOfRecommendedMovies[i].mainGenre === "SCARINESS"){
            amountHorrors++;
        }
        if (finalListOfRecommendedMovies[i].mainGenre === "LOVING"){
            amountRomances++;
        }
        if (finalListOfRecommendedMovies[i].mainGenre === "PENSIVE"){
            amountDramas++;
        }
        if (finalListOfRecommendedMovies[i].mainGenre === "AMUSEMENT"){
            amountAdventures++;
        }
        if (finalListOfRecommendedMovies[i].mainGenre === "RANDOM"){
            amountRandom++;
        }
    }
    document.getElementById("randomShownAmount").innerHTML = "Showing <strong>" + amountRandom +"</strong> RANDOM movies in the current list";
    document.getElementById("comediesShownAmount").innerHTML = "<strong>" + amountComedies +"</strong> movies";
    document.getElementById("horrorsShownAmount").innerHTML = "<strong>" + amountHorrors +"</strong> movies";
    document.getElementById("romancesShownAmount").innerHTML = "<strong>" + amountRomances +"</strong> movies";
    document.getElementById("dramasShownAmount").innerHTML = "<strong>" + amountDramas +"</strong> movies";
    document.getElementById("adventuresShownAmount").innerHTML = "<strong>" + amountAdventures +"</strong> movies";
}

function setFinalListOfRecommendedMovies(list) {
    finalListOfRecommendedMovies = list;
}

function displayRecommendedMovies(movies) {
    $("#listOfMovies").empty();
    for (let i=0;i<movies.length;i++){
        let movie = movies[i];
        displayMovie(movie, i);
    }
    appendBlackCard();
    initializeScrolling();
    setMovieRecommendationsWidth();
}

function displayMovie(movie, number){ //Shows the movie details in the Dom
    let moviePosterPath = movie.poster_path;
    let genres = movie.genre_ids;
    let movieDescription = "";
    if (movie.overview.length>300){
        movieDescription = movie.overview.substring(0,295) + "..."
    }
    else {
        movieDescription = movie.overview;
    }
    let movieAverage = movie.vote_average;
    let movieExplanation = movie.movieExplanation;
    let movieMainGenre = movie.mainGenre;
    let movieHTMLOutput = "";
    movieHTMLOutput =
        "<div class='col-sm-3 align-self-start notSelected' id='movie"+ number +"'>" +
    "<!-- Card -->" +
    "<div id='card"+ number +"' class='card'>" +
    "<!-- Card image -->" +
    "<div class='view view-cascade justify-content-center posterMoviesContainer'>" +
    "<img src='" + posterbaseURL + moviePosterPath + "' class='card-img-top posterMovies' alt='movie poster'>" +
        "<div id='disLikeMask"+ number +"' class='mask flex-center rgba-black-strong invisible'>" +
            "<i id='thumbs' class='fas fa-thumbs-down fa-5x text-light align-middle'></i>" +
        "</div>" +
    "</div>" +
    "<!-- Card content -->" +
    "<div id='cardBody"+ number +"' class='card-body card-body-cascade text-center cardContent align-items-center'>" +
    "<!-- Title -->" +
    "<h5 class='card-subtitle'>" +
    "<strong>" + movieMainGenre + "</strong>" +
    "<a id='movieExplanationButton("+ number +")' class='ml-2 p-0 btn btn-white rounded-circle explanationButton' role='button' onclick='showMovieExplanation()'>" +
    "<i class='far fa-2x fa-question-circle text-dark'></i>" +
    "</a>" +
    "</h5>"+
    "<!-- Text -->" +
    "<p id='movieExplanation"+ number +"' class='font-italic small font-weight-lighter mb-3 animated fadeIn'>" + movieExplanation + "</p>" +
    "<div class='card-text font-weight-bold text-center'>" + getMovieGenres(genres) + "</div>" +
    "<div id='movieDescription"+ number +"' class='mt-2 small font-weight-lighter text-justify animated fadeIn'>" + movieDescription + "</div>" +
    "</div>" +
    "<!-- Card footer -->" +
    "<div class='card-footer text-muted text-center'>" +
    "<span class='text-dark pr-2'>" + movieAverage + "</span>" +
    "<img src='sources/icons/tmdbLogo.svg' width='48' alt='logo'>" +
    "</div>" +
    "</div>" +
    "<!-- Card Ends -->" +
    "</div>";
    $("#listOfMovies").append(movieHTMLOutput);
    $('#movieExplanation'+number.toString()).hide();
}

function appendBlackCard() {
    let html =
        "<div class='col-sm-3 align-self-start invisible'>" +
        "<!-- Card -->" +
        "<div class='card'>" +
        "<!-- Card image -->" +
        "<div class='view view-cascade overlay'>" +
        "<img src='#' class='card-img-top' alt='movie poster'>" +
        "<a>" +
        "<div class='mask rgba-white-slight'></div>" +
        "</a>" +
        "</div>" +
        "<!-- Card content -->" +
        "<div class='card-body card-body-cascade text-center cardContent align-items-center'>" +
        "<!-- Title -->" +
        "<h5 class='card-subtitle mb-2 mt-1'>" +
        "<strong>" + "" + "</strong>" +
        "<a class='ml-2 p-0 btn btn-white rounded-circle explanationButton' role='button'>" +
        "<i class='far fa-2x fa-question-circle text-dark'></i>" +
        "</a>" +
        "</h5>"+
        "<!-- Text -->" +
        "<p class='card-text font-italic mb-3'>" + "" + "</p>" +
        "<div class='card-text font-weight-bold text-center mb-2'>" + "" + "</div>" +
        "<a class='ml-2 btn btn-light text-black-50 explanationButton'>" +
        "" +
        "</a>" +
        "<div class='card-text text-justify'>" + "" + "</div>" +
        "</div>" +
        "<!-- Card footer -->" +
        "<div class='card-footer text-muted text-center'>" +
        "<span class='text-dark pr-2'>" + "" + "</span>" +
        "<img src='#' width='48' alt='logo'>" +
        "</div>" +
        "</div>" +
        "<!-- Card Ends -->" +
        "</div>";
    $("#listOfMovies").append(html);
}

function showRecSysExplanation(){
    let recSysExplanationElement = $("#recSysExplanation");
    let moviesPanelElement = $("#moviesPanel");
    let controlsPanelElement = $("#controlsPanel");
    if(recSysExplanationElement.hasClass("invisible")){
        recSysExplanationElement.removeClass("invisible")
    }
    else{
        recSysExplanationElement.addClass("invisible")
    }
    if(moviesPanelElement.hasClass("backgroundForExplanation")){
        moviesPanelElement.removeClass("backgroundForExplanation")
    }
    else{
        moviesPanelElement.addClass("backgroundForExplanation")
    }
    if(controlsPanelElement.hasClass("backgroundForExplanation")){
        controlsPanelElement.removeClass("backgroundForExplanation")
    }
    else{
        controlsPanelElement.addClass("backgroundForExplanation")
    }
}

function getMovieGenres(genres) {
    let genresList="";
    let lastElement = false;
    for (let i=0;i<genres.length;i++){
        if (i+1===genres.length){
            lastElement = true;
        }
        for (let j=0;j<TMDBgenres.length;j++){
            if (TMDBgenres[j].id===genres[i]){
                if (!lastElement){
                    genresList += TMDBgenres[j].name + ", ";
                }
                else{
                    genresList += TMDBgenres[j].name;
                }
                break;
            }
        }
    }
    return genresList;
}

function setSelectedMovie(number) {
    let currentSelectedMovieElement = $("#movie"+currentSelectedMovieId.toString());
    if(number>-1 && number<finalListOfRecommendedMovies.length){
        currentSelectedMovieElement.addClass("notSelected");
        currentSelectedMovieId = number;
        currentSelectedMovieElement = $("#movie"+currentSelectedMovieId.toString());
        currentSelectedMovieElement.removeClass("notSelected");
    }
}

function getRecommendedMoviesBasedOnMovie(movieId, page, callback) {
    $.ajax({
        url: tmdbAPIbaseURL + movieId + "/recommendations" + "?api_key=" + api_key + "&language=en-US&page="+page,
        success: callback,
        error: function(result){
            console.log("Error with ID:"+ movieId + ", message:" + result.value);
        }
    })
}

function setSlidersAndButtonsForRecs() {
    $sliderComedies.val(100);
    $sliderHorror.val(100);
    $sliderRomance.val(100);
    $sliderDrama.val(100);
    $sliderAdventure.val(100);

    let $valueComedies = $('#valueComedies');
    $valueComedies.html($sliderComedies.val()+"%");
    $sliderComedies.on('change', () => {
        $valueComedies.html($sliderComedies.val()+"%");
        setTimeout(createRecommendations(),2000);
    });

    let $valueHorror = $('#valueHorror');
    $valueHorror.html($sliderHorror.val()+"%");
    $sliderHorror.on('change', () => {
        $valueHorror.html($sliderHorror.val()+"%");
        setTimeout(createRecommendations(),2000);
    });

    let $valueRomance = $('#valueRomance');
    $valueRomance.html($sliderRomance.val()+"%");
    $sliderRomance.on('change', () => {
        $valueRomance.html($sliderRomance.val()+"%");
        setTimeout(createRecommendations(),2000);
    });

    let $valueDrama = $('#valueDrama');
    $valueDrama.html($sliderDrama.val()+"%");
    $sliderDrama.on('change', () => {
        $valueDrama.html($sliderDrama.val()+"%");
        setTimeout(createRecommendations(),2000);
    });

    let $valueAdventure = $('#valueAdventure');
    $valueAdventure.html($sliderAdventure.val()+"%");
    $sliderAdventure.on('change', () => {
        $valueAdventure.html($sliderAdventure.val()+"%");
        setTimeout(createRecommendations(),2000);
    });

    buttonRight.onclick = function () {
        setSelectedMovie(currentSelectedMovieId + 1);
        if ((currentSelectedMovieId>limitRight)&&(limitRight<(finalListOfRecommendedMovies.length-1))){
            scrolling(container,'right',15,moviesAverageWidth,moviesAverageWidth);
            limitRight++;
            limitleft++;
        }
        if(currentSelectedMovieId===(finalListOfRecommendedMovies.length-1)){
            buttonRight.classList.add("invisible");
        }
        buttonLeft.classList.remove("invisible");
    };

    buttonLeft.onclick = function () {
        setSelectedMovie(currentSelectedMovieId - 1);
        if ((currentSelectedMovieId<limitleft)&&(limitleft>0)){
            scrolling(container,'left',15,moviesAverageWidth,moviesAverageWidth);
            limitRight--;
            limitleft--;
        }
        if(currentSelectedMovieId===0){
            buttonLeft.classList.add("invisible");
        }
        buttonRight.classList.remove("invisible");
    };
}

function setMovieRecommendationsWidth() {
    let sum = 0;
    let element = document.getElementById("movie"+1);
    moviesAverageWidth = (element.offsetWidth);
}

function setMovieCardsHeight() {
    let element = document.getElementById("listOfMovies");
    let value = element.offsetHeight;
    if (countHeight!=0){
        for (let i=0;i<finalListOfRecommendedMovies.length;i++) {
            element = document.getElementById("card" + i.toString());
            if (element.offsetHeight<value){
                element.style.height = (value).toString() + "px";
            }
        }
    }
    else {
        for (let i=0;i<finalListOfRecommendedMovies.length;i++) {
            element = document.getElementById("card" + i.toString());
            if (element.offsetHeight<value){
                element.style.height = (value*2.5).toString() + "px";
            }
        }
        countHeight++;
    }
}

function initializeScrolling(){
    setSelectedMovie(0);
    limitleft = 0;
    limitRight = 3;
    container.scrollLeft=0;
    buttonLeft.classList.add("invisible");
    buttonRight.classList.remove("invisible");
}

function scrolling(component,side,speed,distance,quantity){
    scrollAmount = 0;
    var slideTimer = setInterval(function(){
        if(side === "right"){
            component.scrollLeft += quantity;
        } else {
            component.scrollLeft -= quantity;
        }
        scrollAmount += quantity;
        if(scrollAmount >= distance){
            window.clearInterval(slideTimer);
        }
    }, speed);
}

function createRandomRecommendations() { //called when shaking
    let listof20RecommendedMovies = [];
    fillRandomRecommendations(listof20RecommendedMovies);
    listof20RecommendedMovies.sort(orderByRating);
    setFinalListOfRecommendedMovies(listof20RecommendedMovies);
    setGenresAmountForSliders();
    displayRecommendedMovies(finalListOfRecommendedMovies);
}

function dislike() { //called when dislike happens
    let movieDislikeMaskElement = $('#disLikeMask'+currentSelectedMovieId.toString());
    if (movieDislikeMaskElement.hasClass( "invisible" )){
        movieDislikeMaskElement.removeClass( "invisible" );
    }
    else{
        movieDislikeMaskElement.addClass( "invisible" );
    }
}

function showMovieExplanation() {
    let number = currentSelectedMovieId;
    let movieExplanationElement = $('#movieExplanation'+number.toString());
    let cardElement = $('#card'+number.toString());
    let nextCardElement = $('#card'+(number+1).toString());
    if (number>1){
        nextCardElement = $('#card'+(number-1).toString());
    }
    if (movieExplanationElement.is(":hidden")){
        cardElement.css("height","auto");
        movieExplanationElement.show();
    }
    else
    {
        cardElement.css("height",nextCardElement.css("height"));
        movieExplanationElement.hide();
    }
}