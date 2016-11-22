'use strict';

const request = require('request');
const config = require('../config');

module.exports = (toAddress, matchName, subject, message) => {
    let url = `https://api.mailgun.net/v3/${config.mailgunDomain}/messages`;

    let handleResponse= (err, httpResonse, body) => {
        if (err) {
            console.error(err);
            throw err;
        } else {
            console.log(body);
        }
    };

    request.post(url, handleResponse).form({
        from: 'Secret Santa <secretsanta@mattgmade.me>',
        to: toAddress,
        subject: subject || 'Your "Secret Santa" match',
        text: message.replace('{{name}}', matchName) || `Your Secret Santa match is ${matchName}!`,
        'o:tracking-opens': 'yes'
    }).auth(config.mailgunUsername, config.mailgunPassword);
};

