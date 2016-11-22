'use strict';

module.exports =
    function(methods) {
        return function(req, res, next) {
            res.setHeader('Allow', methods.join(', '));
            res.setHeader('Content-Type', 'application/json');

            next();
        };
    };