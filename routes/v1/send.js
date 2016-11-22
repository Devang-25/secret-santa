'use strict';

var express = require('express');
var app = express();
var MatchService = require('../../services/match');
var ensureListValid = require('../../middleware/list-valid');

app.post('/', ensureListValid, function(req, res, next) {
    let list = req.body.list;
    let retryCt = req.body.retryCount || 100;

    let matchService = new MatchService(retryCt);
    let matchResult = matchService.getMatchResult(list);

    if (matchResult) {
        matchResult.forEach(person => {
           //send email 
        });
        
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(matchResult, null, 3));
    } else {
        res.status(409);
        res.send(`Tried ${retryCt} times, could not find a solution where each person has a match.`);
    }
});

app.options('/', function(req, res) {
    
});

module.exports = app;
