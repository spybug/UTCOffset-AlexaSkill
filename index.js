'use strict';
var Alexa = require('alexa-sdk');
var handlers = require('./handlers');

const APP_ID =  process.env['APP_ID'];
const ASK = ':ask';
const TELL = ':tell';

exports.handler = function(event, context, callback) {
	// fix broken skill simulator json
	if (event.context && event.context.System) {
		event.context.System.application.applicationId = event.session.application.applicationId;
		event.context.System.user.userId = event.session.user.userId;
		event.context.System.user.permissions = event.session.user.permissions;
		event.context.System.device = event.session.device;
	}
    var alexa = Alexa.handler(event, context, callback);
	
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
