'use strict';
const passport = require('passport');
const TwitterStrategy = require('passport-twitter');
const jwt = require('jsonwebtoken');
const passportFrameworkPunyware = require('./passport-framework-punyware');

const {
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    OAUTH_CALLBACK_HOST
} = process.env;

passport.use(new TwitterStrategy({
        consumerKey: TWITTER_CONSUMER_KEY,
        consumerSecret: TWITTER_CONSUMER_SECRET,
        callbackURL: OAUTH_CALLBACK_HOST + "/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, cb) {

        return cb(profile);
        // User.findOrCreate({ twitterId: profile.id }, function (err, user) {
        //     return cb(err, user);
        // });
    }
));

const strategyOptions = {};

passport.framework(passportFrameworkPunyware);

module.exports = async ({ meta, payload }) => {

    const { strategy } = payload;
    const auth = passport.authenticate(strategy, strategyOptions);

    const response = await auth(payload);

    switch(response.result) {

    case 'redirect':
        return response;
        break;

    case 'success':
        const token = jwt.sign(
            { response },
            config.jwt.secret
        );

        return {
            error: false,
            result: 'success',
            token
        };
        break;

    default:
        console.error(response);
        throw new Error('error');
    }
};
