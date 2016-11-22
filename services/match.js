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
    let unmatched = list.filter(p => !p.match);

    unmatched.forEach(person => {
        let possibleMatches = list.filter(otherPerson =>
            _isNotMe(person, otherPerson)
            && _isNotInMyExclusionList(person, otherPerson)
            && _isNotAlreadyAssignedToSomoneElse(otherPerson, list));

        if (possibleMatches.length === 0) {
            throw 'Match failed';
        }

        let randomIndex = Math.floor(Math.random() * possibleMatches.length);
        let matchedPerson = possibleMatches[randomIndex];

        person.match = matchedPerson.name;
    });

    return list;
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