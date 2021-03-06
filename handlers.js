'use strict';
var moment = require('moment');
var gmaps = require('googlemaps');
var https = require('https');
const ASK = ':ask';
const TELL = ':tell';
const UTC_SSML = "<say-as interpret-as='spell-out'>utc</say-as>";

var gmapsConfig = {
    key: process.env['GMAPS_API_KEY'],
    stagger_time:       100, // for elevationPath
    encode_polylines:   false,
    secure:             true, // use https
};

var gmapsAPI = new gmaps(gmapsConfig);

var getLatLon = function(context, location, callback) {
    var geocodeParams = {
        'address' : location
    };
    gmapsAPI.geocode(geocodeParams, function(err, result) {
      var latlon = result.results[0].geometry.location;
      var timezone = callback(context, location, latlon.lat, latlon.lng);
      return timezone;
    });
};

var getTimezoneOffset = function(context, locname, lat, lon) {
    var timezoneParams = {
        'location' : `${lat},${lon}`,
        'timestamp' : moment().unix()
    };
    gmapsAPI.timezone(timezoneParams, function(err, result) {
        console.log(result);
        var timezoneOffset = (result.rawOffset + result.dstOffset) / 3600;
        var compareWord = "ahead of";
        if (timezoneOffset < 0) {
            compareWord = "behind";
        }
        context.emit(TELL, `The current offset in ${locname} is <break time="200ms"/> ${timezoneOffset} hours ${compareWord} ${UTC_SSML} time.`);
    });
};

var getCityTime = function(context, locname, lat, lon) {
    var timezoneParams = {
        'location' : `${lat},${lon}`,
        'timestamp' : moment().unix()
    };
    gmapsAPI.timezone(timezoneParams, function(err, result) {
        var timezoneOffset = (result.rawOffset + result.dstOffset) / 3600;
        var curTime = moment().utc().add(timezoneOffset, 'hours');
        var datestr = curTime.format("MMDD");
        var timestr = curTime.format("HH:mm");
        var dateSSML = `<say-as interpret-as='date'>????${datestr}</say-as>`;

        context.emit(TELL, `The current local time in ${locname} is: ${timestr} on ${dateSSML}`);
    });
};

module.exports = {

	"LaunchRequest": function() {
        this.emit(ASK, `This is the ${UTC_SSML} Helper app. It can help you find out the current ${UTC_SSML} time plus the ${UTC_SSML} offset and the current time for locations around the world. If you would like, please ask me any of those things or say stop to exit.`);
    },

    "GetUTCTime": function() {

		var timestamp = moment(this.event.request.timestamp);
		var datestr = timestamp.format("MMDD");
		var timestr = timestamp.format("HH:mm");
		var datessml = `<say-as interpret-as='date'>????${datestr}</say-as>`;

		var result = `The current ${UTC_SSML} time is: ${timestr}, on ${datessml}`;

        this.emit(TELL, result);
	},

	"GetCityOffset": function() {
		try {
            if(this.event.request.intent.slots.location_us.value !== undefined) {
                var loc = this.event.request.intent.slots.location_us.value
                console.log("City offset: " + loc);
                getLatLon(this, loc, getTimezoneOffset);
            }
		}
		catch(e) {
            console.log(e);
			this.emit(TELL, "Error getting utc time from location");
		}
	},

    "GetCityTime": function() {
        try {
            if(this.event.request.intent.slots.location_us.value !== undefined) {
                var loc = this.event.request.intent.slots.location_us.value
                console.log("City time: " + loc);
                getLatLon(this, loc, getCityTime);
            }
		}
		catch(e) {
            console.log(e);
			this.emit(TELL, "Error getting utc time from location");
		}
    },

	"AMAZON.HelpIntent": function() {
		this.emit(ASK, `I can give you the current ${UTC_SSML} time by asking me for the ${UTC_SSML} time. I can also give you the ${UTC_SSML} offset for a location by asking me for the ${UTC_SSML} offset in some location. You can also ask for the local time of that location. Please ask me something now or say stop to exit.`);
	},

	"AMAZON.CancelIntent": function() {
		this.emit(TELL, 'Goodbye.');
	},

	"AMAZON.StopIntent": function() {
		this.emit(TELL, 'Goodbye.');
	}
};
