# Moovie

This is a node module that helps to search for moovies with movie titles.

This is not a function or class to be used directly.

This is a express router.

How to setup the backend API:

    const moovies = require('moovies')
    const express = require('express')
    const app = express()
    app.use('/apipath', moovies)
    app.listen(8000, () => {
        console.log("Server is listening on port 8000");
    })
One single line!
Thats all EASY!

All the responses are in **JSON**  format!
Here is a table showing the parameters returned about each movie from a basic search :
|Name  | Type | Description |
|--|--|--|
| name | string | The name of the movie with year if found |
| icon | url | URL of a small icon to the movie poster |
| imdbid | Alphaneumeric ID | The IMDB id of the movie |

An Example response would look like:

    {
       "matches":[
          {
             "name":"His Dark Materials (2019) (TV Series) ",
             "imdbid":"tt5607976",
             "icon":"https://m.media-amazon.com/images/M/MV5BYmI0M2YwZGItZGYxOC00NTc5LTljY2EtYjBjMTE0MDkxNTMwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_UX32_CR0,0,32,44_AL_.jpg"
          },
          {
             "name":"His Dark Materials (2020) (TV Episode) ",
             "imdbid":"tt13472258",
             "icon":"https://m.media-amazon.com/images/M/MV5BOTgyOTYwNDUtZjllOS00YThmLTkxNjgtM2E1MTcwN2Q5ZmI5XkEyXkFqcGdeQXVyNjY0ODg0MTA@._V1_UY44_CR23,0,32,44_AL_.jpg"
          },
          {
             "name":"\"His Dark Materials\" (2019) (TV Episode) ",
             "imdbid":"tt10477324",
             "icon":"https://m.media-amazon.com/images/M/MV5BNzc4ODk0N2MtZDA4NS00MmM1LTgzYTYtNjIyNzk4YzYwYjNiXkEyXkFqcGdeQXVyODQ4Mjc2NDM@._V1_UX32_CR0,0,32,44_AL_.jpg"
          },
          {
             "name":"Dark Material (2009) (Short) ",
             "imdbid":"tt1528724",
             "icon":"https://m.media-amazon.com/images/S/sash/85lhIiFCmSScRzu.png"
          },
          {
             "name":"His Dark Materials Cast Interview (TV Episode) ",
             "imdbid":"tt13333926",
             "icon":"https://m.media-amazon.com/images/M/MV5BZmRkOTczN2MtYTMyYi00MDUzLWE5OGItOTIwZWM2YzQ2MmI1XkEyXkFqcGdeQXVyNDI0NzUxMTI@._V1_UY44_CR24,0,32,44_AL_.jpg"
          },
          {
             "name":"His Dark Materials: Episodes 1-4 (a Newcomer's Review) (2020) (TV Episode) ",
             "imdbid":"tt12046658",
             "icon":"https://m.media-amazon.com/images/M/MV5BZjE1NGE4N2MtYjBhMi00ZTAxLTk3YmYtMTEyNjRjZjY2Zjc2XkEyXkFqcGdeQXVyMjk3NTAyNg@@._V1_UY44_CR6,0,32,44_AL_.jpg"
          },
          {
             "name":"Nothlits, Dust Bunnies, His Dark Materials (2018) (TV Episode) ",
             "imdbid":"tt9722314",
             "icon":"https://m.media-amazon.com/images/M/MV5BMzBmMmYyZWEtOTNmMi00MGJlLTk4Y2QtODdhYWU2NWY1ZDgzXkEyXkFqcGdeQXVyNzA2MjQ4NTU@._V1_UX32_CR0,0,32,44_AL_.jpg"
          },
          {
             "name":"Pride and Prejudice/His Dark Materials/Birdsong (2003) (TV Episode) ",
             "imdbid":"tt3111530",
             "icon":"https://m.media-amazon.com/images/M/MV5BZTY1MjgzYjQtODYxYS00YTA3LWIxNWEtMmE2YzBlOTc4MjZjXkEyXkFqcGdeQXVyMjkyMzMwNA@@._V1_UY44_CR13,0,32,44_AL_.jpg"
          },
          {
             "name":"Blu-ray & DVD Hunting - His Dark Materials and a shopping basket (2020) (TV Episode) ",
             "imdbid":"tt13726870",
             "icon":"https://m.media-amazon.com/images/M/MV5BODc0Njg4NzItYmY5NS00M2I4LWI1ZWUtNGUxY2UwNzRlMDYxXkEyXkFqcGdeQXVyOTMyODgwOTQ@._V1_UY44_CR6,0,32,44_AL_.jpg"
          }
       ]
    }

Now there are two ways to request.

**Method I [GET REQUEST]**

Here is a simple example just send a get request to the URL or open it in a browser.

    http://localhost/apipath/search/hisdarkmaterials

to generalize:

    [PROTOCOL]://[URL OF SITE]/[API PATH]/[TITLE OF MOVIE TO SEARCH]


**Method II [POST REQUEST]**

Here is the example:

    var xhr = new XMLHttpRequest();
			var url = "http://localhost/apiPath/search";
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.onreadystatechange = function () {
    			if (xhr.readyState === 4 && xhr.status === 200) {
        			var json = JSON.parse(xhr.responseText);
        			var matches =json.matches;
        			var html = "";
        			matches.forEach((item) => {
        			    console.log("Movie : ", item);        			
        			});
    			}
    			else if(xhr.status  === 404){
    				console.log(404);
    			}
			};
			var data = JSON.stringify({"title": "[MOVIE TITLE TO SEARCH]"});
			xhr.send(data);
		};
