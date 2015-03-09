Brandon Huebert

1. We are designing a web app that will decide who someone should be stuck with on a lonely island based on common interests, such as games, books, movies, etc.

2. 
https://www.themoviedb.org/documentation/api

http://steamcommunity.com/dev

http://lab.playme.com/

3.
https://www.themoviedb.org/documentation/api
	This API allows us to retrieve information on movies. We could use it to find 

http://steamcommunity.com/dev
	This API allows us to retrieve information on game usage stats. We could match people based on similar game usage.
	I tried this one first, but it doesnt seem to support JSONP.

http://lab.playme.com/
	We could use this API to find artists similar to a users taste and cross reference that with another users taste.


4.

5.
	Documentation: http://docs.themoviedb.apiary.io/#

	I chose this API because it is involved in many peoples interests and is a good start for comparing people by comparing their interests in movies.
	This can be done by genre, similar titles, producers, etc.

6.
	The only problem I noticed is that when searching, the returned results may contain some outliers. This is shown in the example with 
	the search of Transformers and odd results suchs as "Micro Teukgongdae Daiyateuron 5" and "Resiklo", but they maybe related to transformers
	in description rather than title.

7.
	I found creating the example page to be difficult, because everytime I added a little bit more functionality my output would dissapear,
	but this is due to my lack of experience. I think are team should use this database.

8.
	The example I wrote could be expanded to retrieve a similair list of movies to the movie inputed. This can the be used to return a list of
	people who have common movie interests. It can also be used to retrieve detailed information on a particular movie that a person likes, so the user
	can decide whether they should pass on a person or not.
