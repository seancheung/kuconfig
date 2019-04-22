function $abs(params) {
    if (params == null) {
        return params;
    }
    if (typeof params === 'number') {
        return Math.abs(params);
    }
    throw new Error('$abs expects a number');
}

function $add(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        params.every(p => typeof p === 'number')
    ) {
        return params[0] + params[1];
    }
    throw new Error('$add expects an array of two numbers');
}

function $sub(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        params.every(p => typeof p === 'number')
    ) {
        return params[0] - params[1];
    }
    throw new Error('$sub expects an array of two numbers');
}

function $mul(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        params.every(p => typeof p === 'number')
    ) {
        return params[0] * params[1];
    }
    throw new Error('$mul expects an array of two numbers');
}

function $div(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        params.every(p => typeof p === 'number')
    ) {
        return params[0] / params[1];
    }
    throw new Error('$div expects an array of two numbers');
}

function $mod(params) {
    if (
        Array.isArray(params) &&
        params.length === 2 &&
        params.every(p => typeof p === 'number')
    ) {
        return Math.floor(params[0] / params[1]);
    }
    throw new Error('$mod expects an array of two numbers');
}

function $ceil(params) {
    if (params == null) {
        return params;
    }
    if (typeof params === 'number') {
        return Math.ceil(params);
    }
    throw new Error('$ceil expects a number');
}

function $floor(params) {
    if (params == null) {
        return params;
    }
    if (typeof params === 'number') {
        return Math.floor(params);
    }
    throw new Error('$floor expects a number');
}

function $round(params) {
    if (params == null) {
        return params;
    }
    if (typeof params === 'number') {
        return Math.round(params);
    }
    throw new Error('$round expects a number');
}

function $trunc(params) {
    if (params == null) {
        return params;
    }
    if (typeof params === 'number') {
        return Math.trunc(params);
    }
    throw new Error('$trunc expects a number');
}

function $sign(params) {
    if (params == null) {
        return params;
    }
    if (typeof params === 'number') {
        return Math.sign(params);
    }
    throw new Error('$sign expects a number');
}

module.exports = {
    $abs,
    $add,
    $sub,
    $mul,
    $div,
    $mod,
    $ceil,
    $floor,
    $round,
    $trunc,
    $sign,
    '+': $add,
    '-': $sub,
    '*': $mul,
    '/': $div,
    '%': $mod
};
