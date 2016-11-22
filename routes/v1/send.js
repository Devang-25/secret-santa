'use strict';

var express = require('express');
var app = express();
var MatchService = require('../../services/match');
var sendMail = require('../../services/mailgun');
var ensureListValid = require('../../middleware/list-valid');
var allow = require('../../middleware/options');

app.post('/', ensureListValid, function(req, res, next) {
    let list = req.body.list;
    let retryCt = req.body.retryCount || 100;

    let matchService = new MatchService(retryCt);
    let matchResult = matchService.getMatchResult(list);

    if (matchResult) {
        matchResult.forEach(person => {
            if (person.email) {
                sendMail(person.email, person.match);
            }
        });
        
        res.setHeader('Content-Type', 'application/json');
        res.send('Emails sent successfully.');
    } else {
        res.status(409);
        res.send(`Tried ${retryCt} times, could not find a solution where each person has a match.`);
    }
});

app.options('/', allow(['POST']), function(req, res) {
    res.send()
});

module.exports = app;
