# Liri Node App

## About the project:
In this assignment, we had to build an app called LIRI. LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a Language Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

To retrieve the data that will power this app, I used the following node packages:
  * Axios package (for sending requests)
  * Bands in Town API (to get back band/artist info)
  * Spotify API (to get back song info)
  * OMDB API (to get back movie info)
  * Moment node package (to format the concert date for te bands in town requrement)
  * DotEnv (a zero-dependency module that loads environment variables from a .env file into process.env.)

Liri takes in one of the following commands:
  1. 'concert-this'
  2. 'spotify-this-song'
  3. 'movie-this'
  4. 'do-what-it-says'

What Each Command Does.
  * node liri.js concert-this <artist/band name here>
    This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
      1. Name of the venue
      2. Venue location
      3. Date of the Event (use moment to format this as "MM/DD/YYYY")

  * node liri.js spotify-this-song '<song name here>'
    This will show the following information about the song in your terminal/bash window
      1. Artist(s)
      2. The song's name
      3. A preview link of the song from Spotify
      4. The album that the song is from
      5. If no song is provided then your program will default to "The Sign"      by Ace of Base.

  * node liri.js movie-this '<movie name here>'
    This will output the following information to your terminal/bash window:
      1. Title of the movie.
      2. Year the movie came out.
      3. IMDB Rating of the movie.
      4. Rotten Tomatoes Rating of the movie.
      5. Country where the movie was produced.
      6. Language of the movie.
      7. Plot of the movie.
      8. Actors in the movie.
      2. If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

  * node liri.js do-what-it-says
    Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
    It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
  
## Techologies used to build:
  * Node.js
  * JavaScript
  * API's & Node packages mentioned above

## Methodology:

## Problems That I Overcame:

The one main problem I faced was trying to get the specific modal to open correctly. At first, only the first modal would open for a featured project eventhough you clicked on one of the other two. I found out how to fix this by specifying the data-target attribute. The code snippet is below.

## Code Snippets:

Capturing CLI user input and programming Liri what command goes with what logic (function).
```
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
```
Function for 'movie-this'.
```
// Function for getting the moving data from omdb using axios.
function getMovieInfo() {
  // Creating an empty string to store whatever the user types for movie-this. 
  var movieName = '';
  // Creating a for-loop to to solve the problem if the name of the movie is more than one word. 
  for (var i = 3; i < nodeArguments.length; i++) {
    // In English, this says if i, is greater than indice 2 (first two are file paths and third indice is the command movie-this) and less than whatever the length of the movie the user typed for movie-this, then that's the movie. 
    if (i > 3 && i < nodeArguments.length) {
      movieName = `${movieName} ${nodeArguments[i]}` // <-- using back-ticks with $ and {} instead of '' and concatonation. (source CodeAcadamy).
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
```

Function for 'concert-this'.
```
// Function for getting the artist/band data from bands in town using axios.
function getArtistInfo() {
  // Creating an empty string to store whatever the user types for concert-this. 
  var artistName = '';
  // Creating a for-loop to to solve the problem if the name of the artist is more than one word. 
  for (var i = 3; i < nodeArguments.length; i++) {
    // This says if i, is greater than indice 2 (first two are file paths and third indice is the command concert-this) and less than whatever the length of the artist the user typed for concert-this, then that's the movie. 
    if (i > 3 && i < nodeArguments.length) {
      artistName = `${artistName} ${nodeArguments[i]}` // <-- using back-ticks with $ and {} instead of '' and concatonation. (source CodeAcadamy).
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
```

