'use strict';
var moment = require('moment');
var gmaps = require('googlemaps');
//var https = require('https');
const ASK = ':ask';
const TELL = ':tell';
const UTC_SSML = "<say-as interpret-as='spell-out'>utc</say-as>";

var gmapsConfig = {
    key: process.env['GMAPS_API_KEY'],
    stagger_time:       100, // for elevationPath
    encode_polylines:   false,
    secure:             true, // use https
};

var gmapsAPI = gmaps(gmapsConfig);

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
                loc = this.event.request.intent.slots.location_us.value
                var geocodeParams = {
                    address=loc
                };
                gmapsAPI.geocode(geocodeParams, function(err, result){
                  console.log(result);
                });
            }
		}
		catch(e) {
			this.emit(TELL, "Error getting local time from device");
			console.log(e)
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
	},

	getAlexaLocation : function(deviceId, token) {
		var alexa_api = `https://api.amazonalexa.com/v1/devices/${deviceId}/settings/address/countryAndPostalCode`
		var alexa_headers = {'Accept': 'application/json', 'Authorization': `Bearer ${token}`}
		var options = {hostname: alexa_api, headers: alexa_headers, method: 'GET'};
		console.log(options);
		https.get(options, (res) => {
			var body = '';
			res.on('data', (data) => {
				body += data;
			});
			res.on('end', () => {
				var data = JSON.parse(body);
				console.log(data);
				return {
					countryCode: data.countryCode,
					postalCode: data.postalCode
				};
			});
		})
	},

	getLatLon : function(countryCode, postalCode) {
		console.log(countryCode);
		console.log(postalCode);
	}
};
