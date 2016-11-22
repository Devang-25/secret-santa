'use strict';

const getMatchResult = require('../../services/match');
const ensureListValid = require('../../middleware/list-valid');
const allow = require('../../middleware/options');
const json = require('../../middleware/format-json');
const express = require('express');

const app = express();

app.post('/', ensureListValid, (req, res, next) => {
    let list = req.body.list;
    let retryCt = req.body.retryCount || 100;

    let matchResult = getMatchResult(list, retryCt);

    if (matchResult) {
      res.locals.data = { list: matchResult };
      return next();
    }

    res.status(409);
    res.send(`Tried ${retryCt} times, could not find a solution where each person has a match.`);
}, json);

app.options('/', allow(['GET', 'POST', 'OPTIONS']), (req, res, next) => {
  res.locals.data = {
    '/match': {
      'POST': {
        'description': 'Return a randomized Secret Santa match result for the provided list.',
        'parameters': {
          'list': 'An array of people. Each person will get matched with one other person if possible.',
          'retryCount': '(Optional) Times to attempt to find a solution. Defaults to 100 if not provided. You may want to increase this number if you have complicated lists.',
          'person.name': '(Required) This name will be used in emails to identify this person.',
          'person.exclusions': '(Optional) An array of names representing the people that this person should not be paired up with. Note: Heavy use of exclusions can create lists that have no possible match solutions.'
        },
        'example': {
          'list': [{
            'name': 'Matt',
            'exclusions': ['Nikki']
          }, {
            'name': 'Nikki',
            'exclusions': ['Matt', 'Jim']
          }, {
            'name': 'Jim',
            'exclusions': ['Nikki']
          }, {
            'name': 'Mary',
          }],
          'retryCount': 500
        }
      }
    }
  };
  next();
}, json);

module.exports = app;
