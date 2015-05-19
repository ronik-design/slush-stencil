exports.compile = function () {
    return '_output += \'<!-- tacos! -->\';';
};

exports.parse = function () {
    return true;
};

exports.ends = false;
