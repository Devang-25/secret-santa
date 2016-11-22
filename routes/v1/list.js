'use strict';

const ensureListValid = require('../../middleware/list-valid');
const allow = require('../../middleware/options');
const express = require('express');

const  app = express();

// Get all lists overview
app.get('/', (req, res, next) => {
  res.status(501);
  res.send();
});

//Get list detail
app.get('/:id', (req, res, next) => {
  res.status(501);
  res.send();
});

//Create list
app.post('/', ensureListValid, (req, res, next) => {
  res.status(501);
  res.send();
});

//Update/Replace list
app.put('/:id', ensureListValid, (req, res, next) => {
  res.status(501);
  res.send();
});

//Update partial list
app.patch('/:id', (req, res, next) => {
  res.status(501);
  res.send();
});

//Delete list
app.delete('/:id', (req, res, next) => {
  res.status(501);
  res.send();
});

//Update/Replace list
app.options('/', allow(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']), (req, res, next) => {
  res.send(JSON.stringify({
    '/list': {
      'GET': { description: 'Get an overview of all lists'},
      'POST': { description: 'Create a new list' }
      },
    '/list/:id': {
      'GET': { description: 'Get the full details of a list'},
      'PUT': { description: 'Update a list' },
      'PATCH': { description: 'Partially update a list' },
      'DELETE': { description: 'Delete a list' }
      }
    }), null, 3);
});

module.exports = app;
