'use strict';

module.exports = class MatchService {
    constructor(retryCt) {
        this.retryCt = retryCt;
    }

    getMatchResult(list) {
        for (let i = 0; i < this.retryCt; i++) {
            try {
                return this._tryGetMatchResult(list);
            }
            catch (err) {
            }
        }
    }


    _tryGetMatchResult(list) {
        let matches = [];

        list.forEach(person => {
            let possibleMatches = list.filter(otherPerson =>
                this._isNotMe(person, otherPerson)
                && this._isNotInMyExclusionList(person, otherPerson)
                && this._isNotAlreadyAssignedToSomoneElse(otherPerson, matches));

            if (!possibleMatches.length) {
                throw 'Match failed';
            }

            let randomIndex = Math.floor(Math.random() * possibleMatches.length);
            let matchedPerson = possibleMatches[randomIndex];

            matches.push(Object.assign(person, {match: matchedPerson.name}));
        });

        return matches;
    }

    _isNotMe(me, person) {
        return me.name !== person.name;
    }

    _isNotInMyExclusionList(me, person) {
        if (!me.exclusions)
            return true;

        return me.exclusions.every(excludedName => excludedName !== person.name)
    }

    _isNotAlreadyAssignedToSomoneElse(person, matches) {
        return matches.every(m => m.match !== person.name);
    }
}

/*
module.exports = {
    getMatchResult: (list, retryCt) => {
        for (let i = 0; i < retryCt; i++) {
           try {
               return tryGetMatchResult(list);
           }
           catch (err) {}
        }
    }
}

function tryGetMatchResult(list) {
    let matches = [];

    list.forEach(person => {
        let possibleMatches = list.filter(otherPerson =>
            isNotMe(person, otherPerson)
            && isNotInMyExclusionList(person, otherPerson)
            && isNotAlreadyAssignedToSomoneElse(otherPerson, matches));

        if (possibleMatches.length === 0) {
            throw 'Match failed';
        }

        let randomIndex = Math.floor(Math.random() * possibleMatches.length);
        let matchedPerson = possibleMatches[randomIndex];

        matches.push(Object.assign(person, { match: matchedPerson.name }));
    });

    return matches
}

function isNotMe(me, person) {
    return me.name !== person.name;
}

function isNotInMyExclusionList(me, person) {
    if (!me.exclusions)
        return true;

    return me.exclusions.every(excludedName => excludedName !== person.name)
}

function isNotAlreadyAssignedToSomoneElse(person, matches) {
    return matches.every(m => m.match !== person.name);
}*/