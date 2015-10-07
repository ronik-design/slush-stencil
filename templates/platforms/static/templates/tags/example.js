exports.compile = function () {
    return '_output += \'<!-- example tacos! -->\';';
};

exports.parse = function () {
    return true;
};

exports.ends = false;
