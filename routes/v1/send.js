'use strict';

const getMatchResult = require('../../services/match');
const sendMail = require('../../services/mailgun');
const ensureListValid = require('../../middleware/list-valid');
const allow = require('../../middleware/options');
const json = require('../../middleware/format-json');
const express = require('express');

const app = express();

app.post('/', ensureListValid, (req, res, next) => {
    let list = req.body.list;
    let retryCt = Math.min(req.body.retryCount || 100, 10000);

    let matchResult = getMatchResult(list, retryCt);

    if (matchResult) {
        matchResult.forEach(person => {
            if (person.email) {
                try {
                    sendMail(person.email, person.match, req.body.subject, req.body.message);
                }
                catch(err) {
                    res.status(503);
                    return res.send('An error occurred when attempting to send the emails.');
                }
            }
        });
        
        res.setHeader('Content-Type', 'application/json');
        res.send('Emails sent successfully.');
    } else {
        res.status(409);
        res.send(`Tried ${retryCt} times, could not find a solution where each person has a match.`);
    }
});

app.options('/', allow(['POST']), (req, res, next) => {
    res.locals.data = {
        '/send': {
            'POST': {
                'description': 'Create a randomized Secret Santa match result for the provided list and send out emails containing the match to each recipient.',
                'parameters': {
                    'list': 'An array of people. Each person will get matched with one other person if possible.',
                    'subject': '(Optional) The subject of the email to be sent. Defaults to \'Your "Secret Santa" match\' if not provided.',
                    'message': '(Optional) The message of the email to be sent. Use {{name}} to insert the name of the match into the message. Defaults to "Your Secret Santa match is {{name}}!" if not provided.',
                    'retryCount': '(Optional) Times to attempt to find a solution. Defaults to 100 if not provided. You may want to increase this number if you have complicated lists.',
                    'person.name': '(Required) This name will be used in emails to identify this person.',
                    'person.email': '(Optional) The email address to use for this person. An email will not be sent to this person if this field is not populated.',
                    'person.exclusions': '(Optional) An array of names representing the people that this person should not be paired up with. Note: Heavy use of exclusions can create lists that have no possible match solutions.'
                },
                'example': {
                    'subject': 'Your Secret Santa victim awaits...',
                    'message': 'Your match is {{name}}! The price limit for gifts is $50.',
                    'list': [{
                        'name': 'Matt',
                        'email': 'matt@abc123.com',
                        'exclusions': ['Nikki']
                    }, {
                        'name': 'Nikki',
                        'email': 'nikki@abc123.com',
                        'exclusions': ['Matt', 'Jim']
                    }, {
                        'name': 'Jim',
                        'email': 'jim@abc123.com',
                        'exclusions': ['Nikki']
                    }, {
                        'name': 'Mary',
                        'email': 'sandy@abc123.com'
                    }],
                    'retryCount': 500
                }
            }
        }
    };
    next();
}, json);

module.exports = app;
