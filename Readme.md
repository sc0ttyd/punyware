Introducing Punyware
====================

Punyware is an minimal interface signature designed to allow framework- and serverlessness- agnostic behaviour so that the same code can be tested and ran on a local middleware style stack such as Koa,
or on a serverless platform such as AWS Lambda.

The Punyware Signature
----------------------

```javascript
// we are using ES7 async/await here as it makes internal flow control so straightforward.
// Alternatively, use a normal function and return a promise.
async (request) => {
    
    const { meta, payload } = request;

    // @payload is usually formed from the body (in a POST request),
    // or a decoded query string object (in a GET request),
    // or a JSON payload (in a websocket message or redux action),
    // or whatever is relevant in an AWS Lambda event.

    // @meta can contain data such as request-id, auth token,
    // originating route, and other headers.

    // if a punyware request encounters an error, just throw it.
    // the punycode adapter will handle this appropriately for the
    // environment we are executing in.
    if (problem) {
        throw new Error('shit');
    }

    // if there is any response needed, return it as a POJO.
    return stuffToUser;
}
```


koa-wrapper
===========

```
async (ctx, next) => {
    
    const event = {
        path: ctx.path,
        body: ctx.body
    }

    ctx.body = unified(event);
}
```

lambda-wrapper
==============
```
(event, context, callback) => {
    unified(event)
        .then(function(err, res)
            callback(res);
        })
        .catch(function(err) {
            callback(err);
        });
}
```
