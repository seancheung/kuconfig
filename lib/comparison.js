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

function $eql(params) {
    if (Array.isArray(params) && params.length === 2) {
        return params[0] == params[1];
    }
    throw new Error('$eql expects an array of two elements');
}

function $neql(params) {
    if (Array.isArray(params) && params.length === 2) {
        return params[0] != params[1];
    }
    throw new Error('$neql expects an array of two elements');
}

module.exports = {
    $gt,
    $gte,
    $lt,
    $lte,
    $eq,
    $eql,
    $ne,
    $neql,
    $in,
    $ni,
    '>': $gt,
    '>=': $gte,
    '<': $lt,
    '<=': $lte,
    '===': $eq,
    '==': $eql,
    '!==': $ne,
    '!=': $neql
};
