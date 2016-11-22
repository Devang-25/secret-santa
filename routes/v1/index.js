var express = require('express');
var app = express();
var allow = require('../../middleware/options');

app.options('/', allow(['OPTIONS']), function(req, res) {
    res.send(JSON.stringify({
        "/": {
            "GET": {
                'description': 'the app'
            }
        },
        "/list": "Gives authenticated users CRUD operations for building a secret santa list.",
        '/match/:listId?': 'Finds matches for all people in a secret santa list.',
        '/send/:matchResultId?': 'Sends the final secret santa emails to each person in a list according to the matches in the provided match result.'
    }, null, 3));
});

module.exports = app;
