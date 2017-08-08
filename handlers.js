'use strict';
var moment = require('moment');
const ASK = ':ask'
const TELL = ':tell'
const UTC_SSML = "<say-as interpret-as='spell-out'>utc</say-as>"

module.exports = {

	"LaunchRequest": function() {
        this.emit(TELL, `This is the ${UTC_SSML} Offset app.`);
    },

    "GetUTCTime": function() {
		
		var timestamp = moment(this.event.request.timestamp);
		var datestr = timestamp.format("MMDD");
		var timestr = timestamp.format("HH:mm");
		var datessml = `<say-as interpret-as='date'>????${datestr}</say-as>`;
		console.log(`date: ${datestr}\t time: ${timestr}`);
		console.log(datessml);
		
		var result = `The current ${UTC_SSML} time is: ${timestr}, on ${datessml}`;
		console.log(result);
		
        this.emit(TELL, result);
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
