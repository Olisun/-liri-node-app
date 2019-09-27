// This reads and sets any environment variables with dotenv. 
require('dotenv').config();

// This imports the keys.js file with has my spotify id and secret id mapped from my .env file with actually has the ids stored (.env is part of .gitignore). 
var keys = require('./keys.js');

// Setting variables to the node packages needed. 
var axios = require('axios');
var moment = require('moment');
var Spotify = require('node-spotify-api');
var fs = require('fs');

// Storing the arguments in an array in order to capture user input in the command line. 
var nodeArguments = process.argv;
var nodeCommand = process.argv[2];

// Creating logic for Liri so she knows what function to run when the user types in one of the specific commands ()
if (nodeCommand === 'movie-this') {
  getMovieInfo();
} else if (nodeCommand === 'concert-this') {
  getArtistInfo();
} else if (nodeCommand === 'do-what-it-says') {
  randomTextInstx();
} else if (nodeCommand === 'spotify-this-song') {
  getSpotifyInfo();
} else {
  console.log('Not a valid command!');
};

// Function for getting the moving data from omdb using axios.
function getMovieInfo() {
  // Creating an empty string to store whatever the user types for movie-this. 
  var movieName = '';
  // Setting a variable for song input after spotify command
  var movieInput = process.argv[3]
    // If no song is inputted after the command, the default song will be 'The Sign'.
  if (!movieInput) {
    movieName = 'Mr. Nobody'
  }
  // Creating a for-loop to to solve the problem if the name of the movie is more than one word. 
  for (var i = 3; i < nodeArguments.length; i++) {
    // In English, this says if i, is greater than indice 2 (first two are file paths and third indice is the command movie-this) and less than whatever the length of the movie the user typed for movie-this, then that's the movie. 
    if (i > 3 && i < nodeArguments.length) {
      movieName = `${movieName} ${nodeArguments[i]}` // <-- using back-ticks with $ and {} instead of '' and concatonation.
        //Otherwise, if i is just one word, that's also the movie.
    } else {
      movieName += nodeArguments[i];
    };
  };
  // Setting the queryURL equal to a variable. 
  var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=abb02c3b";

  // Now time to use axios through a promise function. 
  axios.get(queryURL).then(
      function(movieResponse) {
        console.log('Movie Title: ' + movieResponse.data.Title);
        console.log('Year: ' + movieResponse.data.Year);
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

// Function for getting the artist/band data from bands in town using axios.
function getArtistInfo() {
  // Creating an empty string to store whatever the user types for concert-this. 
  var artistName = '';
  // Creating a for-loop to to solve the problem if the name of the artist is more than one word. 
  for (var i = 3; i < nodeArguments.length; i++) {
    // This says if i, is greater than indice 2 (first two are file paths and third indice is the command concert-this) and less than whatever the length of the artist the user typed for concert-this, then that's the movie. 
    if (i > 3 && i < nodeArguments.length) {
      artistName = `${artistName} ${nodeArguments[i]}` // <-- using back-ticks with $ and {} instead of '' and concatonation.
        //Otherwise, if i is just one word, that's also the artist. 
    } else {
      artistName += nodeArguments[i];
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
      if (error.songResponse) {
        // Successful request but the server came back with a status code outside of the range of 2xx. 
        console.log("---------------Data---------------");
        console.log(error.artistResponse.data);
        console.log("---------------Status---------------");
        console.log(error.artistResponse.status);
        console.log("---------------Status---------------");
        console.log(error.artistResponse.headers);
      } else if (error.request) {
        // Successful request but no songResponse came back. You'll get details of the error in error.request in the form of an object.
        console.log(error.request);
      } else {
        // Unsuccessful request.
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
};

// Function for getting the artist/band data from bands in town using axios.
function getSpotifyInfo() {
  // Establishing the id and secret id stored in the keys.js file. 
  var spotify = new Spotify(keys.spotify)
    // Creating an empty string to store whatever the user types for concert-this. 
  var songName = '';
  // Setting a variable for song input after spotify command
  var songInput = process.argv[3]
    // If no song is inputted after the command, the default song will be 'The Sign'.
  if (!songInput) {
    songName = 'Shoot to Thrill'
  }
  // Creating a for-loop to to solve the problem if the name of the artist is more than one word. 
  for (var i = 3; i < nodeArguments.length; i++) {
    // This says if i, is greater than indice 2 (first two are file paths and third indice is the command concert-this) and less than whatever the length of the artist the user typed for concert-this, then that's the movie. 
    if (i > 3 && i < nodeArguments.length) {
      songName = `${songName} ${nodeArguments[i]}` // <-- using back-ticks with $ and {} instead of '' and concatonation. 
        //Otherwise, if i is just one word, that's also the artist. 
    } else {
      songName += nodeArguments[i];
    };
  };
  // Using Spotiy's node API package to retreive song data.
  spotify.request("https://api.spotify.com/v1/search?q=track:" + songName + "&type=track&limit=10").then(function(songResponse) {
    console.log('Song: ' + songResponse.tracks.items[0].name);
    console.log('Artist: ' + songResponse.tracks.items[0].artists[0].name);
    console.log('Spotify Link: ' + songResponse.tracks.items[0].preview_url);
    console.log('Album: ' + songResponse.tracks.items[0].album.name);
    // These tell you what the errors messages are if any. 
  }).catch(function(error) {
    if (error.songResponse) {
      // Successful request but the server came back with a status code outside of the range of 2xx. 
      console.log("---------------Data---------------");
      console.log(error.songResponse.data);
      console.log("---------------Status---------------");
      console.log(error.songResponse.status);
      console.log("---------------Status---------------");
      console.log(error.songResponse.headers);
    } else if (error.request) {
      // Successful request but no songResponse came back. You'll get details of the error in error.request in the form of an object.
      console.log(error.request);
    } else {
      // Unsuccessful request.
      console.log("Error", error.message);
    }
    console.log(error.config);
  });
};

// Function for getting the text from inside random.txt and then use it to call one of liri's commands.
function randomTextInstx(data, dataTwo) {
  // This uses fs's node package to read the contents of random.txt and store it in a variable named data. utf8 is included as a parameter to prevent garbage data from being included.
  fs.readFile('random.txt', 'utf8', function(error, data) {
    // This if statement is used for error checking.
    if (error) {
      return console.log(error);
    };
    // This will print the text inside of random.txt to the console. 
    console.log(data);
    // This will take the text inside of random.txt; split it where the comma is and put it all in an array. The comma in the text desiignates the indice. 
    var dataArray = data.split(',');
    // The new array will look like this example --> ['spotify-this-song', '"I want it That Way"']. 
    console.log(dataArray)
      // This is supposed to run the getSpotifyInfo function but it's returning undefined in the terminal. Still working on this!
    getSpotifyInfo(dataArray[0], dataArray[1]);
  })
}