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

var getTimezone = function(context, locname, lat, lon) {
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

module.exports = {

	"LaunchRequest": function() {
        this.emit(TELL, `This is the ${UTC_SSML} Offset app.`);
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
                console.log(loc);
                var result = getLatLon(this, loc, getTimezone);
            }
		}
		catch(e) {
            console.log(e);
			this.emit(TELL, "Error getting utc time from location");
		}
	},

	"AMAZON.HelpIntent": function() {
		this.emit(ASK, `Please ask for the current time in ${UTC_SSML}`);
	},

	"AMAZON.CancelIntent": function() {
		this.emit(TELL, 'Goodbye.');
	},

	"AMAZON.StopIntent": function() {
		this.emit(TELL, 'Goodbye.');
	}
};
