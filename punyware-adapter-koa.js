'use strict';

module.exports = punyware => {
    return async(ctx, next) => {

        const message = {
            payload: {
                body: ctx.body,
                params: ctx.params
            },
            raw: ctx
        };

        try {
            ctx.body = await punyware(message);
        } catch (e) {
            ctx.throw(e);
        }
    };
};
