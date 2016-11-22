'use strict';

var express = require('express');
var app = express();
var MatchService = require('../../services/match');

app.post('/', function(req, res, next) {
    let list = req.body.list;
    let retryCt = req.body.retryCount || 100;

    if (!list) {
        res.status(400);
        return res.send('"list" array is required.');
    }

    if (list.length <= 1) {
        res.status(400);
        return res.send('"list" must contain two or more people.');
    }

    let uniqueNames = list.map(p => p.name)
        .filter((value, index, self) => self.indexOf(value) === index);

    if (uniqueNames.length < list.length) {
        res.status(400);
        return res.send('Each name must be unique. How else will people know who to buy gifts for?');
    }

    let matchService = new MatchService(retryCt);
    let matchResult = matchService.getMatchResult(list);

    if (matchResult) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(matchResult, null, 3));
    } else {
        res.status(409);
        res.send(`Tried ${retryCt} times, could not find a solution where each person has a match.`);
    }
});

module.exports = app;
