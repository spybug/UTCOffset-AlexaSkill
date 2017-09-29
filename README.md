<h1> Skill Overview 
  <a href="https://www.amazon.com/Karl-I-UTC-Helper/dp/B0756TB5TT/">
    <img src="https://images-na.ssl-images-amazon.com/images/I/61PpZudD5XL._SL210_QL95_BG0,0,0,0_FMpng_.png" width="100"> 
  </a> 
</h1>

An Alexa skill that calculates the UTC time offset for different locations. It can also give the current local time for a location and the current UTC time.

A link to the published skill on the Amazon store is here: https://www.amazon.com/Karl-I-UTC-Helper/dp/B0756TB5TT/


<h3> How it Works: </h3>

The user first intitates the skill by supplying a location and asking for either the current time or the UTC offset. The skill then uses the location to query the Google Maps API Geocoding call and get the latitude/longitude for the location. Using these coordinates the Google Maps API is queried again to get the timezone information for that location. Then a response is formatted matching what the initial request was and returns the result. 

<h3> Planned added features: </h3>

* Using the previously requested location in the session for future requests about that location.
* Ability to send a card with the results to the Alexa app for viewing the info it returned for later.
