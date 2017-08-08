'use strict';
var moment = require('moment');
//var https = require('https');
const ASK = ':ask';
const TELL = ':tell';
const UTC_SSML = "<say-as interpret-as='spell-out'>utc</say-as>";

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
	
	"GetLocalOffset": function() {
		try {
			var deviceId = this.event.context.System.device.deviceId;
			var token = this.event.context.System.user.permissions.consentToken;
			alexa_location = module.exports.getAlexaLocation(deviceId, token);
			lat_lon = module.exports.getLatLon(alexa_location.countryCode, alexa_location.postalCode);
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
