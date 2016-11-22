var express = require('express');
var app = express();

// Get all lists overview
app.get('/', (req, res, next) => {
  //TODO: return all lists
  res.status(501);
  res.send();
});

//Get list detail
app.get('/:id', function(req, res, next) {
  res.status(501);
  res.send();
});

//Create list
app.post('/', function(req, res, next) {
  res.status(501);
  res.send();
});

//Update/Replace list
app.put('/:id', function(req, res, next) {
  res.status(501);
  res.send();
});

//Update partial list
app.patch('/:id', function(req, res, next) {
  res.status(501);
  res.send();
});

//Delete list
app.delete('/:id', function(req, res, next) {
  res.status(501);
  res.send();
});

//Update/Replace list
app.options('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Allow', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
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
    }));
});

module.exports = app;
