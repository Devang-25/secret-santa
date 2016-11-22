'use strict';

var express = require('express');
var app = express();
var MatchService = require('../../services/match');
var ensureListValid = require('../../middleware/list-valid');
var allow = require('../../middleware/options');

app.post('/', ensureListValid, function(req, res, next) {
    let list = req.body.list;
    let retryCt = req.body.retryCount || 100;
    

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

app.options('/', allow(['GET', 'POST', 'OPTIONS']), function(req, res, next) {
  res.send(JSON.stringify({
    '/match': {
      'POST': {
        'description': 'Return a randomized Secret Santa match result for the provided list.',
        'parameters': {
          'list': 'An array of people. Each person will get matched with one other person if possible.',
          'retryCount': '(Optional) Times to attempt to find a solution. Defaults to 100 if not provided. You may want to increase this number if you have complicated lists.',
          'person.name': '(Required) This name will be used in emails to identify this person.',
          'person.email': '(Optional) The email address to use for this person. An email will not be sent to this person if this field is not populated.',
          'person.exclusions': '(Optional) An array of names representing the people that this person should not be paired up with. Note: Heavy use of exclusions can create lists that have no possible match solutions.'

        },
        'example': {
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
  }, null, 3));
});

module.exports = app;
