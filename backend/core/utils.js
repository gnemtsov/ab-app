'use strict';

exports.coalesce = (...args) => {
    const len = args.length;
    if (len) {
        for (var i = 0; i < len; i++) {
            if (args[i] !== null && args[i] !== undefined) {
                return args[i];
            }
        }
    }
    return null;
}
