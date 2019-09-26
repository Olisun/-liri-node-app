// This reads and sets any environment variables with dotenv. 
require('dotenv').config();

// This imports the keys.js file with has my spotify id and secret id mapped from my .env file with actually has the ids stored (.env is part of .gitignore). 
var keys = require('./keys.js');
// var spotify = new Spotify(keys.spotify)

// Setting variables to the node packages needed. 
var axios = require('axios');
var moment = require('moment');
var spotifyAPI = require('node-spotify-api');
var fs = require('fs');

// Storing the arguments in an array in order to capture user input in the command line. 
var nodeArgument = process.argv;
var nodeCommand = process.argv[2];

// Creating a function to retreive the movie info from omdb using axios.
function getMovieInfo() {
  // Creating an empty string to store whatever the user types for movie-this. 
  var movieName = '';
  // Creating a for-loop to to solve the problem if the name of the movie is more than one word. 
  for (var i = 2; i < nodeArgument.length; i++) {
    // In English, this says if i, is greater than indice 2 (first two are file paths and third indice is the command movie-this) and less than whatever the length of the movie the user typed for movie-this, then that's the movie. 
    if (i > 2 && i < nodeArgument.length) {
      movieName = `${movieName} ${nodeArgument[i]}` // <-- using back-ticks with $ and {} is tge same as ""'s but you don't need to concact with a '+'. (source CodeAcadamy).
        //Otherwise, if i is just one word, that's also the movie.
    } else {
      movieName += nodeArgument[i];
    };
  };
  // Setting the queryURL equal to a variable. 
  var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=abb02c3b";

  // Now time to use axios through a promise function. 
  axios.get(queryURL).then(
      function(movieResponse) {
        console.log('Movie Title: ' + movieResponse.data.Title);
        console.log('IMDB Rating: ' + movieResponse.data.imdbRating);
        console.log('Rotten Tomatos Rating: ' + movieResponse.data.Ratings[1].Value);
        console.log('Country Produced: ' + movieResponse.data.Country);
        console.log('Language: ' + movieResponse.data.Language);
        console.log('Plot: ' + movieResponse.data.Plot);
        console.log('Actors & Actresses: ' + movieResponse.data.Actors);
      })
    // These tell you what the errors messages are if any. 
    .catch(function(error) {
      if (error.movieResponse) {
        // Successful request but the server came back with a status code outside of the range of 2xx. 
        console.log("---------------Data---------------");
        console.log(error.movieResponse.data);
        console.log("---------------Status---------------");
        console.log(error.movieResponse.status);
        console.log("---------------Status---------------");
        console.log(error.movieResponse.headers);
      } else if (error.request) {
        // Successful request but no movieResponse came back. You'll get details of the error in error.request in the form of an object.
        console.log(error.request);
      } else {
        // Unsuccessful request.
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
};

getMovieInfo();

// Creating a function to retreive the artist info from bands in town using axios.
function getArtistInfo() {
  // Creating an empty string to store whatever the user types for concert-this. 
  var artistName = '';
  // Creating a for-loop to to solve the problem if the name of the artist is more than one word. 
  for (var i = 2; i < nodeArgument.length; i++) {
    // This says if i, is greater than indice 2 (first two are file paths and third indice is the command concert-this) and less than whatever the length of the artist the user typed for concert-this, then that's the movie. 
    if (i > 2 && i < nodeArgument.length) {
      artistName = `${artistName} ${nodeArgument[i]}` // <-- using back-ticks with $ and {} is tge same as ""'s but you don't need to concact with a '+'. (source CodeAcadamy).
        //Otherwise, if i is just one word, that's also the artist. 
    } else {
      artistName += nodeArgument[i];
    };
  };
  // Setting the queryURL equal to a variable. 
  var queryURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

  // Now time to use axios through a promise function. 
  axios.get(queryURL).then(
      function(artistResponse) {
        console.log('Venue Name: ' + artistResponse.data[0].venue.name);
        console.log('Venue Location: ' + artistResponse.data[0].venue.city);
        console.log('Concert Date: ' + moment(artistResponse.data[0].datetime).format('MM/DD/YYYY'));

      })
    // These tell you what the errors messages are if any. 
    .catch(function(error) {
      if (error.artistResponse) {
        // Successful request but the server came back with a status code outside of the range of 2xx. 
        console.log("---------------Data---------------");
        console.log(error.artistResponse.data);
        console.log("---------------Status---------------");
        console.log(error.artistResponse.status);
        console.log("---------------Status---------------");
        console.log(error.artistResponse.headers);
      } else if (error.request) {
        // Successful request but no artistResponse came back. You'll get details of the error in error.request in the form of an object.
        console.log(error.request);
      } else {
        // Unsuccessful request.
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
};

getArtistInfo();