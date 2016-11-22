'use strict';

module.exports = (list, retryCt) => {
    for (let i = 0; i < retryCt; i++) {
       try {
           return _tryGetMatchResult(list);
       }
       catch (err) {}
    }
};

function _tryGetMatchResult(list) {
    let matches = [];

    list.forEach(person => {
        let possibleMatches = list.filter(otherPerson =>
            _isNotMe(person, otherPerson)
            && _isNotInMyExclusionList(person, otherPerson)
            && _isNotAlreadyAssignedToSomoneElse(otherPerson, matches));

        if (possibleMatches.length === 0) {
            throw 'Match failed';
        }

        let randomIndex = Math.floor(Math.random() * possibleMatches.length);
        let matchedPerson = possibleMatches[randomIndex];

        matches.push(Object.assign(person, { match: matchedPerson.name }));
    });

    return matches
}

function _isNotMe(me, person) {
    return me.name !== person.name;
}

function _isNotInMyExclusionList(me, person) {
    if (!me.exclusions)
        return true;

    return me.exclusions.every(excludedName => excludedName !== person.name)
}

function _isNotAlreadyAssignedToSomoneElse(person, matches) {
    return matches.every(m => m.match !== person.name);
}