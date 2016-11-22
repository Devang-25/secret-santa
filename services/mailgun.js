'use strict';

const request = require('request');
const config = require('../config');

module.exports = function (toAddress, matchName, subject, message) {
    let url = `https://api.mailgun.net/v3/${config.mailgunDomain}/messages`;

    let handleResponse= (err, httpResonse, body) => {
        if (err)
            console.error(err);
        else 
            console.log(body);
    };

    request.post(url, handleResponse).form({
        from: 'Secret Santa <secretsanta@mattgmade.me>',
        to: toAddress,
        subject: subject || 'Your "Secret Santa" match is...',
        text: message || `Your Secret Santa pairing is ${matchName}! Don\'t tell anyone!`
    }).auth(config.mailgunUsername, config.mailgunPassword);
};

