const api_key = "f6e86a545df19d917c415a89c7adffb8";
const posterbaseURL = "http://image.tmdb.org/t/p/original/";
const tmdbAPIbaseURL = "https://api.themoviedb.org/3/movie/";

const othersId=496243; // Parasite
const others2Id=490132; // Green Book

const $sliderComediesCS = $('#sliderComediesCS');
const $sliderAdventureCS = $('#sliderAdventureCS');
const $sliderDramaCS = $('#sliderDramaCS');
const $sliderHorrorCS = $('#sliderHorrorCS');
const $sliderRomanceCS = $('#sliderRomanceCS');

let TMDBgenres = [];
let movieList = [];
let othersList = [];
let selectedCSList = [];

let selectedCSShownMoviesList = [];

$(document).ready(function () {
    localStorage.clear();
    setSlidersForCs();
    getRecommendedMoviesBasedOnMovie(othersId,1,function (result) {
         $("#listofCSmovies").empty();
         let csmovies= [];
         csmovies = result.results;
         getRecommendedMoviesBasedOnMovie(others2Id,1,function (result) {
             othersList = csmovies.concat(result.results);
             eraseRepeatedMoviesforCS(othersList);
             let displayList = [];
             let index = Math.floor(Math.random() * othersList.length);
             while (displayList.length < 18) {
                 if (!displayList.includes(othersList[index])){
                     displayList.push(othersList[index]);
                 }
                 index = Math.floor(Math.random() * othersList.length);
             }
             setSelectedCSShownMoviesList(displayList);
             displayMoviesForCS(selectedCSShownMoviesList);
         });
     });
});

function setSlidersForCs() {
    $sliderComediesCS.val(100);
    $sliderAdventureCS.val(100);
    $sliderDramaCS.val(100);
    $sliderHorrorCS.val(100);
    $sliderRomanceCS.val(100);

    let $valueComediesCS = $('#valueComediesCS');
    $valueComediesCS.html($sliderComediesCS.val()+"%");
    $sliderComediesCS.on('change', () => {
        $valueComediesCS.html($sliderComediesCS.val()+"%");
    });

    let $valueAdventureCS = $('#valueAdventureCS');
    $valueAdventureCS.html($sliderAdventureCS.val()+"%");
    $sliderAdventureCS.on('change', () => {
        $valueAdventureCS.html($sliderAdventureCS.val()+"%");
    });

    let $valueDramaCS = $('#valueDramaCS');
    $valueDramaCS.html($sliderDramaCS.val()+"%");
    $sliderDramaCS.on('change', () => {
        $valueDramaCS.html($sliderDramaCS.val()+"%");
    });

    let $valueHorrorCS = $('#valueHorrorCS');
    $valueHorrorCS.html($sliderHorrorCS.val()+"%");
    $sliderHorrorCS.on('change', () => {
        $valueHorrorCS.html($sliderHorrorCS.val()+"%");
    });

    let $valueRomanceCS = $('#valueRomanceCS');
    $valueRomanceCS.html($sliderRomanceCS.val()+"%");
    $sliderRomanceCS.on('change', () => {
        $valueRomanceCS.html($sliderRomanceCS.val()+"%");
    });
}

function eraseRepeatedMoviesforCS(movieList) {
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

function setSelectedCSShownMoviesList(list) {
    selectedCSShownMoviesList = list;
}

function displayMoviesForCS(movies) {
    for (let i=0;i<movies.length;i++){
        let movie = movies[i];
        displayMovieForCS(movie,i);
    }
}

function displayMovieForCS(movie,number){ //Shows the movie for CS
    let moviePosterPath = movie.poster_path;
    let movieHTMLOutput = "";
    movieHTMLOutput =
        "<div class='col'>" +
            "<div id='movieCS" + number + "' class='view overlay mb-2' onmouseleave='checkMask(" + number + ")' onclick='defineSelectedMovieCS(" + number + ")'>" +
                "<img class='img-fluid' src='" + posterbaseURL + moviePosterPath + "' alt='image'>" +
                "<div id='mask' class='mask flex-center rgba-black-strong'>" +
                    "<i id='thumbs' class='fas fa-thumbs-up fa-3x text-light align-middle'></i>" +
                "</div>" +
            "</div>" +
        "</div>";
    $("#listofCSmovies").append(movieHTMLOutput);
}

function defineSelectedMovieCS(number) {
    let recSysButton = $("#recSysButton");
    if (selectedCSList.includes(number)){
        if (!(recSysButton.hasClass("disabled"))){
            recSysButton.addClass("disabled");
            recSysButton.addClass("btn-outline-light");
            recSysButton.addClass("text-light");
            recSysButton.removeClass("btn-light");
            recSysButton.removeClass("text-black-50");
            recSysButton.html(
                "Please, select your favorite movies and your gender preferences before going to your recommendations"
            );
        }
        for (let i=0;i<selectedCSList.length;i++){
            let movieCSElement = $("#movieCS"+selectedCSList[i].toString());
            if (selectedCSList[i]===number){
                movieCSElement.addClass("overlay");
                movieCSElement.find("#mask").removeClass("rgba-black-light");
                movieCSElement.find("#mask").addClass("rgba-black-strong");
                movieCSElement.find("#mask").addClass("invisible");
                selectedCSList.splice(i,1);
            }
        }
        for (let i=0;i<18;i++){
            let movieCSElementHere = $("#movieCS"+i.toString());
            if (!(selectedCSList.includes(i))){
                movieCSElementHere.addClass("overlay");
                setTimeout( function(){
                    movieCSElementHere.find("#thumbs").css("opacity","1");
                },500);
            }
            else{

                movieCSElementHere.find("#mask").removeClass("rgba-black-light");
                movieCSElementHere.find("#mask").addClass("rgba-black-strong");
            }
        }
    }
    else {
        checkMask(number);
        if (selectedCSList.length<3){
            selectedCSList.push(number);
            $("#movieCS"+number.toString()).removeClass("overlay");
            if (selectedCSList.length===3){
                for (let i=0;i<18;i++){
                    let movieCSElementHere = $("#movieCS"+i.toString());
                    movieCSElementHere.removeClass("overlay");
                    if (!(selectedCSList.includes(i))){
                        //$("#movieCS"+i.toString()).find("#thumbs").addClass("invisible");
                        $("#movieCS"+i.toString()).find("#thumbs").css("opacity","0");
                    }
                    else{
                        movieCSElementHere.find("#mask").removeClass("rgba-black-strong");
                        movieCSElementHere.find("#mask").addClass("rgba-black-light");
                    }
                }
                let recSysButtonElement = $("#recSysButton");
                window.scrollBy(0,document.body.scrollHeight);
                recSysButtonElement.removeClass("disabled");
                recSysButtonElement.removeClass("btn-outline-light");
                recSysButtonElement.removeClass("text-light");
                recSysButtonElement.addClass("btn-light");
                recSysButtonElement.addClass("text-black-50");
                recSysButtonElement.html("Let's go to your recommendations!");
            }
        }
    }
}

function checkMask(number) {
    let movieCSElement = $("#movieCS"+number.toString());
    if(movieCSElement.find("#mask").hasClass("invisible")){
        movieCSElement.find("#mask").removeClass("invisible");
    }
}

function goToRecommendations(){
    localStorage.setItem("csComedies",$sliderComediesCS.val());
    localStorage.setItem("csHorrors",$sliderHorrorCS.val());
    localStorage.setItem("csRomances",$sliderRomanceCS.val());
    localStorage.setItem("csDramas",$sliderDramaCS.val());
    localStorage.setItem("csAdventures",$sliderAdventureCS.val());

    let selectedMovieCs1 =  JSON.stringify(selectedCSShownMoviesList[selectedCSList[0]]);
    let selectedMovieCs2 =  JSON.stringify(selectedCSShownMoviesList[selectedCSList[1]]);
    let selectedMovieCs3 =  JSON.stringify(selectedCSShownMoviesList[selectedCSList[2]]);

    localStorage.setItem("MovieCS1",selectedMovieCs1);
    localStorage.setItem("MovieCS2",selectedMovieCs2);
    localStorage.setItem("MovieCS3",selectedMovieCs3);
}
