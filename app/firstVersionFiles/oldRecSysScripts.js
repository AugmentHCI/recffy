const api_key = "f6e86a545df19d917c415a89c7adffb8";
const posterbaseURL = "http://image.tmdb.org/t/p/original/";
const tmdbAPIbaseURL = "https://api.themoviedb.org/3/movie/";

const othersId=399055; // The Shape of Water
const others2Id=496243; // Parasite

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

let movieListRecSys = [];
let othersListRecSys = [];
let finalListOfRecommendedMovies = [];

let countHeight = 0;

$(document).ready(function () {
    let csComedies = localStorage.getItem("csComedies");
    let csHorrors =localStorage.getItem("csHorrors");
    let csRomances =localStorage.getItem("csRomances");
    let csDramas =localStorage.getItem("csDramas");
    let csAdventures =localStorage.getItem("csAdventures");

    setSlidersAndButtonsForRecs(csComedies,csHorrors,csRomances,csDramas,csAdventures);

    let movieCS1 = JSON.parse(localStorage.getItem("MovieCS1"));
    let movieCS2 = JSON.parse(localStorage.getItem("MovieCS2"));
    let movieCS3 = JSON.parse(localStorage.getItem("MovieCS3"));

    loadRecommendedMovies(movieCS1,movieCS2,movieCS3);
});

function loadRecommendedMovies(firstMovie,secondMovie,thirdMovie) {
    let firstMovieId = firstMovie.id, secondMovieId = secondMovie.id, thirdMovieId = thirdMovie.id;
    let firstMovieName = firstMovie.title, secondMovieName = secondMovie.title, thirdMovieName = thirdMovie.title;
    let firstMovieRecs = [], secondMovieRecs = [], thirdMovieRecs = [];
    let others = [], others1 = [], others2 = [], others3 = [], others4 = [];
    getRecommendedMoviesBasedOnMovie(firstMovieId, 1, function (result) {
        firstMovieRecs = assignExplanation(result.results,firstMovieName);
        getRecommendedMoviesBasedOnMovie(secondMovieId, 1, function (result) {
            secondMovieRecs = assignExplanation(result.results,secondMovieName);
            getRecommendedMoviesBasedOnMovie(thirdMovieId, 1, function (result) {
                thirdMovieRecs = assignExplanation(result.results,thirdMovieName);
                getRecommendedMoviesBasedOnMovie(othersId, 1, function (result) {
                    others1 = result.results;
                    getRecommendedMoviesBasedOnMovie(othersId, 2, function (result) {
                        others2 = others1.concat(result.results);
                        getRecommendedMoviesBasedOnMovie(others2Id, 2, function (result) {
                            others3 = others2.concat(result.results);
                            getRecommendedMoviesBasedOnMovie(othersId, 2, function (result) {
                                others = others3.concat(result.results);
                                let listOfAllRecommendations = firstMovieRecs.concat(secondMovieRecs, thirdMovieRecs);
                                eraseRepeatedMovies(listOfAllRecommendations, firstMovieId, secondMovieId, thirdMovieId);
                                randomizeMovies(listOfAllRecommendations);
                                setMovieList(listOfAllRecommendations);
                                eraseRepeatedMovies(others,firstMovieId, secondMovieId, thirdMovieId);
                                eraseRepeatedMoviesForOthers(others,listOfAllRecommendations);
                                randomizeMovies(others);
                                setOthersList(others);
                                setTMDBgenres();
                                createRecommendations();
                            });
                        });
                    });
                });
            });
        });
    });
}

function assignExplanation(listOfMovies, movieExplanation) {
    if (movieExplanation==="Random"){
        for (let i=0;i<listOfMovies.length;i++){
            listOfMovies[i].movieExplanation = "This movie is a random recommendation";
        }
    }
    else {
        for (let i=0;i<listOfMovies.length;i++){
            listOfMovies[i].movieExplanation = "Recommended because you preferred <strong class='text-uppercase'>" + movieExplanation + "</strong>";
        }
    }
    return listOfMovies;
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

function eraseRepeatedMovies(movieList, firstId, secondId, thirdId) {
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
        while (movieList[i].id===(firstId||secondId||thirdId)){
            movieList.splice(i,1);
        }
    }
}

function eraseRepeatedMoviesForOthers(othersList,movieList) {
    for (let i=0;i<movieList.length;i++){
        let movie = movieList[i];
        for (let j = 0;j<othersList.length;j++){
            let otherMovie = othersList[j];
            if ((otherMovie.id===movie.id)){
                othersList.splice(j,1);
            }
        }
    }
}

function setMovieList(movies) {
    movieListRecSys = movies;
}

function setOthersList(movies) {
    othersListRecSys = movies;
}

function createRecommendations() {
    let amountComedies = obtainAmountofMoviesByGenderFromControls(35),
        amountHorrors = obtainAmountofMoviesByGenderFromControls(27),
        amountRomances = obtainAmountofMoviesByGenderFromControls(10749),
        amountDramas = obtainAmountofMoviesByGenderFromControls(18),
        amountAdventures = obtainAmountofMoviesByGenderFromControls(12);
    let listof20RecommendedMovies = [];
    if ((amountComedies+amountHorrors+amountRomances+amountDramas+amountAdventures)>0){
        obtainMoviesByGenderFromTheListOfMovies(listof20RecommendedMovies,amountHorrors,27);
        obtainMoviesByGenderFromTheListOfMovies(listof20RecommendedMovies,amountAdventures,12);
        obtainMoviesByGenderFromTheListOfMovies(listof20RecommendedMovies,amountRomances,10749);
        obtainMoviesByGenderFromTheListOfMovies(listof20RecommendedMovies,amountComedies,35);
        obtainMoviesByGenderFromTheListOfMovies(listof20RecommendedMovies,amountDramas,18);
        listof20RecommendedMovies.sort(orderByRating);
        listof20RecommendedMovies.sort(orderByComplementary);
    }
    else{
        obtainMoviesByGenderFromTheListOfMovies(listof20RecommendedMovies,15,0);
        listof20RecommendedMovies.sort(orderByRatingRandom);
    }
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

function setGenresAmountForSliders() {
    let amountComedies = 0, amountHorrors = 0, amountRomances = 0, amountDramas = 0, amountAdventures =0;
    for (let i=0;i<finalListOfRecommendedMovies.length;i++){
        if (finalListOfRecommendedMovies[i].mainGenre.includes('COMEDY')){
            amountComedies++;
        }
        if (finalListOfRecommendedMovies[i].mainGenre.includes('HORROR')){
            amountHorrors++;
        }
        if (finalListOfRecommendedMovies[i].mainGenre.includes('ROMANCE')){
            amountRomances++;
        }
        if (finalListOfRecommendedMovies[i].mainGenre.includes('DRAMA')){
            amountDramas++;
        }
        if (finalListOfRecommendedMovies[i].mainGenre.includes('ADVENTURE')){
            amountAdventures++;
        }
    }
    document.getElementById("comediesShownAmount").innerHTML = "Showing: <strong>" + amountComedies +"</strong> movies";
    document.getElementById("horrorsShownAmount").innerHTML = "Showing: <strong>" + amountHorrors +"</strong> movies";
    document.getElementById("romancesShownAmount").innerHTML = "Showing: <strong>" + amountRomances +"</strong> movies";
    document.getElementById("dramasShownAmount").innerHTML = "Showing: <strong>" + amountDramas +"</strong> movies";
    document.getElementById("adventuresShownAmount").innerHTML = "Showing: <strong>" + amountAdventures +"</strong> movies";
}

function obtainMoviesByGenderFromTheListOfMovies(list,number,genre) {
    if (number>0){
        if (genre===0){
            for (let i=0;i<number;i++){
                let movie = movieListRecSys[i];
                movie.mainGenre = "RANDOM suggestion";
                list.push(movie);
            }
        }
        else {
            for (let i=0;i<movieListRecSys.length;i++){
                if ((movieListRecSys[i].genre_ids.includes(genre))&&(number>0)&&(!list.includes(movieListRecSys[i]))){
                    movieListRecSys[i].mainGenre = "Recommended " + assignMainGenre(genre);
                    list.push(movieListRecSys[i]);
                    number--;
                }
                if (number===0){
                    break;
                }
            }
            if(number>0){
                let extraExplanation = getExtraExplanationForGenre(genre);
                for (let i=0;i<othersListRecSys.length;i++){
                    if ((number>0)&&(othersListRecSys[i].genre_ids.includes(genre)&&(!list.includes(othersListRecSys[i])))){
                        othersListRecSys[i].movieExplanation = extraExplanation;
                        othersListRecSys[i].mainGenre = "Suggested "+assignMainGenre(genre);
                        list.push(othersListRecSys[i]);
                        number--;
                        if (number===0){
                            break;
                        }
                    }
                }
                // while (number>0){
                //     getARandomMovie(list,genre);
                //     number--;
                // }
            }
        }
    }
}

function getARandomMovie(listOfMovies,genre) {
    randomNumber=Math.floor(Math.random() * finalListOfRecommendedMovies.length);
    console.log(randomNumber);
    while (listOfMovies.includes(finalListOfRecommendedMovies[randomNumber])){
        randomNumber=Math.floor(Math.random() * finalListOfRecommendedMovies.length);
        console.log(randomNumber);
    }
    console.log(listOfMovies);
    //othersListRecSys[randomNumber].movieExplanation = getExtraExplanationForRandom(genre);
    finalListOfRecommendedMovies[randomNumber].mainGenre = "A movie suggestion";
    listOfMovies.push(finalListOfRecommendedMovies[randomNumber]);
}

function assignMainGenre(genre) {
    let mainGenre = "";
    switch (genre) {
        case 35:
            mainGenre = "COMEDY";
            break;
        case 27:
            mainGenre = "HORROR";
            break;
        case 10749:
            mainGenre = "ROMANCE";
            break;
        case 12:
            mainGenre = "ADVENTURE";
            break;
        case 18:
            mainGenre = "DRAMA";
            break;
        case 0:
            mainGenre = "RANDOM";
            break;
        default:
            break;
    }
    return mainGenre;
}

function getExtraExplanationForGenre(genre) {
    let explanation = "";
    switch (genre) {
        case 35:
            explanation = "Suggested <strong>COMEDY</strong> due to a lack of recommendations for this genre based on your three preferred movies";
            break;
        case 27:
            explanation = "Suggested <strong>HORROR</strong> due to a lack of recommendations for this genre based on your three preferred movies";
            break;
        case 10749:
            explanation = "Suggested <strong>ROMANCE</strong> due to a lack of recommendations for this genre based on your three preferred movies";
            break;
        case 12:
            explanation = "Suggested <strong>ADVENTURE</strong> due to a lack of recommendations for this genre based on your three preferred movies";
            break;
        case 18:
            explanation = "Suggested <strong>DRAMA</strong> due to a lack of  recommendations based on your three preferred movies";
            break;
        default:
            break;
    }
    return explanation;
}

function getExtraExplanationForRandom(genre) {
    let explanation = "";
    switch (genre) {
        case 35:
            explanation = "Suggested <strong>RANDOMLY</strong> due to a lack of <strong>COMEDY</strong> recommendations based on your three preferred movies";
            break;
        case 27:
            explanation = "Suggested <strong>RANDOMLY</strong> due to a lack of <strong>HORROR</strong> recommendations based on your three preferred movies";
            break;
        case 10749:
            explanation = "Suggested <strong>RANDOMLY</strong> due to a lack of <strong>ROMANCE</strong> recommendations based on your three preferred movies";
            break;
        case 12:
            explanation = "Suggested <strong>RANDOMLY</strong> due to a lack of <strong>ADVENTURE</strong> recommendations based on your three preferred movies";
            break;
        case 18:
            explanation = "Suggested <strong>RANDOMLY</strong> due to a lack of <strong>DRAMA</strong> recommendations based on your three preferred movies";
            break;
        case 0:
            explanation = "Suggested <strong>randomly</strong>";
            break;
        default:
            break;
    }
    return explanation;
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
    //let movieTitle = movie.title;
    let genres = movie.genre_ids;
    let movieDescription = movie.overview;
    let movieAverage = movie.vote_average;
    //let isRandom = movie.isARandomMovie;
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
    "</div>" +
    "<!-- Card content -->" +
    "<div id='cardBody"+ number +"' class='card-body card-body-cascade text-center cardContent align-items-center'>" +
    "<!-- Title -->" +
    "<h5 class='card-subtitle'>" +
    "<strong>" + movieMainGenre + "</strong>" +
    "<a id='movieExplanationButton("+ number +")' class='ml-2 p-0 btn btn-white rounded-circle explanationButton' role='button' onclick='showMovieExplanation("+ number +")'>" +
    "<i class='far fa-2x fa-question-circle text-dark'></i>" +
    "</a>" +
    "</h5>"+
    "<!-- Text -->" +
    "<p id='movieExplanation"+ number +"' class='font-italic small font-weight-lighter mb-3 animated fadeIn'>" + movieExplanation + "</p>" +
    "<div class='card-text font-weight-bold text-center'>" + getMovieGenres(genres) + "</div>" +
    "<a id='movieDescriptionButton"+ number +"' class='btn btn-light text-black-50 explanationButton' role='button' onclick='showMovieDescription("+ number +")'>" +
    "Show movie description" +
    "</a>" +
    "<div id='movieDescription"+ number +"' class='small font-weight-lighter text-justify animated fadeIn'>" + movieDescription + "</div>" +
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
    $('#movieDescription'+number.toString()).hide();
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

function showMovieExplanation(number) {
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

function showMovieDescription(number) {
    let movieDescriptionElement = $('#movieDescription'+number.toString());
    let movieDescriptionButton = $('#movieDescriptionButton'+number.toString());
    let cardElement = $('#card'+number.toString());
    let nextCardElement = $('#card'+(number+1).toString());
    if (number>1){
        let nextCardElement = $('#card'+(number-1).toString());
    }
    if (movieDescriptionElement.is(":hidden")){
        cardElement.css("height","auto");
        movieDescriptionElement.show();
        movieDescriptionButton.html("Hide movie description");
    }
    else
    {
        cardElement.css("height",nextCardElement.css("height"));
        movieDescriptionElement.hide();
        movieDescriptionButton.html("Show movie description");
    }
}

function orderByComplementary(movie1,movie2){
    if (movie2.mainGenre.includes('Recommended')||movie1.mainGenre.includes('Suggested')){
        return 1;
    }
    if (movie1.mainGenre.includes('Recommended')||movie2.mainGenre.includes('Suggested')){
        return -1;
    }
    return 0;
}

function orderByRating(movie1,movie2){
    if (movie2.vote_average<movie1.vote_average){
        return 1;
    }
    if(movie2.vote_average>=movie1.vote_average){
        return -1;
    }
    return 0;
}

function orderByRatingRandom(movie1,movie2){
    if (movie1.vote_average<movie2.vote_average){
        return 1;
    }
    if(movie1.vote_average>=movie2.vote_average){
        return -1;
    }
    return 0;
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

function setTMDBgenres() {
    TMDBgenres = [
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

function setSlidersAndButtonsForRecs(comedies,horrors,romances,dramas,adventures) {
    $sliderComedies.val(comedies);
    $sliderHorror.val(horrors);
    $sliderRomance.val(romances);
    $sliderDrama.val(dramas);
    $sliderAdventure.val(adventures);

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