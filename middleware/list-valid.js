'use strict';

module.exports = function(req, res, next) {
    let list = req.body.list;

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

    next();
};