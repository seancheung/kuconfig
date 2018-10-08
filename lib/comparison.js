function $gt(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        params.every(p => typeof p === 'number')
    ) {
        return params[0] > params[1];
    }
    throw new Error('$gt expects an array of two numbers');
}

function $gte(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        params.every(p => typeof p === 'number')
    ) {
        return params[0] >= params[1];
    }
    throw new Error('$gt expects an array of two numbers');
}

function $lt(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        params.every(p => typeof p === 'number')
    ) {
        return params[0] < params[1];
    }
    throw new Error('$gt expects an array of two numbers');
}

function $lte(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        params.every(p => typeof p === 'number')
    ) {
        return params[0] <= params[1];
    }
    throw new Error('$gt expects an array of two numbers');
}

function $eq(params) {
    if (Array.isArray(params) && params.length === 2) {
        return params[0] === params[1];
    }
    throw new Error('$eq expects an array of two elements');
}

function $ne(params) {
    if (Array.isArray(params) && params.length === 2) {
        return params[0] !== params[1];
    }
    throw new Error('$ne expects an array of two elements');
}

function $in(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        Array.isArray(params[1])
    ) {
        return params[1].indexOf(params[0]) >= 0;
    }
    throw new Error(
        '$in expects an array of two elements of which the seconds must be an array'
    );
}

function $ni(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        Array.isArray(params[1])
    ) {
        return params[1].indexOf(params[0]) < 0;
    }
    throw new Error(
        '$ni expects an array of two elements of which the seconds must be an array'
    );
}

function $eqv(params) {
    if (Array.isArray(params) && params.length === 2) {
        return params[0] == params[1];
    }
    throw new Error('$eqv expects an array of two elements');
}

function $nev(params) {
    if (Array.isArray(params) && params.length === 2) {
        return params[0] != params[1];
    }
    throw new Error('$nev expects an array of two elements');
}

module.exports = {
    $gt,
    $gte,
    $lt,
    $lte,
    $eq,
    $eqv,
    $ne,
    $nev,
    $in,
    $ni,
    '>': $gt,
    '>=': $gte,
    '<': $lt,
    '<=': $lte,
    '===': $eq,
    '==': $eqv,
    '!==': $ne,
    '!=': $nev
};
