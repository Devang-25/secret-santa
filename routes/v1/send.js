'use strict';

const getMatchResult = require('../../services/match');
const sendMail = require('../../services/mailgun');
const ensureListValid = require('../../middleware/list-valid');
const allow = require('../../middleware/options');
const express = require('express');

const app = express();

app.post('/', ensureListValid, (req, res, next) => {
    let list = req.body.list;
    let retryCt = req.body.retryCount || 100;

    let matchResult = getMatchResult(list, retryCt);

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

app.options('/', allow(['POST']), (req, res) => {
    res.send()
});

module.exports = app;
