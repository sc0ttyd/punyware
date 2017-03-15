'use strict';

exports.initialize = () => {};

exports.authenticate = function authenticate(passport, name, options = {}) {

    if (!Array.isArray(name)) { name = [name]; }

    return function authenticate(message) {

        const failures = [];
        const response = defer();

        function allFailed() {
            response.resolve({
                success: false,
                result: 'failure',
                failures: failures
            });
        }

        (function attempt(i = 0) {
            const layer = name[i];

            // If no more strategies exist in the chain, authentication has failed.
            if (!layer) { return allFailed(); }

            const prototype = passport._strategy(layer);

            if (!prototype) {
                response.reject(new Error('Unknown authentication strategy "' + layer + '"'));
                return;
            }

            const strategy = Object.create(prototype);

            strategy.success = function(user, info) {
                response.resolve({
                    success: true,
                    result : 'success',
                    user,
                    info
                });
            };

            strategy.fail = function(challenge, status) {
                if (typeof challenge == 'number') {
                    status = challenge;
                    challenge = undefined;
                }

                failures.push({ challenge, status });
                attempt(i + 1);
            };

            strategy.redirect = function(url, status) {
                response.resolve({
                    success: true,
                    result: 'redirect',
                    url,
                    status
                });
            };

            strategy.pass = function() {};
            strategy.error = response.reject;
            strategy.authenticate(message, options);
        })();

        return response.promise;
    };
};

function defer() {
    var resolve, reject;
    var promise = new Promise(function() {
        resolve = arguments[0];
        reject = arguments[1];
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
}
