const rateLimit = require('express-rate-limit');


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: (req, res) => {
        if (req.url == '/user/login') {
            return 3;
        }
        else {
            return 50
        }
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: "Too many requests. Please try again later.",
    statusCode: 429,
})


module.exports = limiter;