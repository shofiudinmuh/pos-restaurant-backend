// const { ApiLog } = require('../models');
// const { v4: uuidv4 } = require('uuid');

// module.exports = (req, res, next) => {
//     const start = Date.now();
//     const originalSend = res.send;

//     res.send = async function (body) {
//         try {
//             await ApiLog.create({
//                 api_log_id: uuidv4(),
//                 user_id: req.user?.user_id || null,
//                 session_id: req.user ? await getSessionId(req) : null,
//                 endpoint: req.originalUrl,
//                 method: req.method,
//                 status_code: res.statusCode,
//                 request_body: req.body ? JSON.stringify(req.body) : null,
//                 response_body: typeof body === 'string' ? body : JSON.stringify(body),
//                 created_at: new Date(),
//             });
//         } catch (error) {
//             console.error('Error logging API request: ', error);
//         }

//         return originalSend.call(this, body);
//     };

//     res.on('finish', () => {
//         const duration = Date.now() - start;
//         console.log(`${req.method} ${req.originalUrl} ${statusCode} ${duration}ms`);
//     });

//     next();
// };

// async function getSessionId(req) {
//     const token = req.headers.authorization?.split('')[1];
//     if (token) {
//         const { Token } = require('../models');
//         tokenRecord = await Token.findOne({
//             where: { token, type: 'access' },
//         });
//         return tokenRecord?.session_id || null;
//     }

//     return null;
// }
const { ApiLog, Token } = require('../models');
const { v4: uuidv4 } = require('uuid');

module.exports = (req, res, next) => {
    const start = Date.now();
    const originalSend = res.send;

    res.send = async function (body) {
        try {
            await ApiLog.create({
                api_log_id: uuidv4(),
                user_id: req.user?.user_id || null,
                session_id: req.user ? await getSessionId(req) : null,
                endpoint: req.originalUrl,
                method: req.method,
                status_code: res.statusCode,
                request_body: req.body ? JSON.stringify(req.body) : null,
                response_body: typeof body === 'string' ? body : JSON.stringify(body),
                created_at: new Date(),
            });
        } catch (error) {
            console.error('Error logging API request:', error);
        }

        return originalSend.call(this, body);
    };

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
        // ⬆ perbaikan utama: pakai res.statusCode, bukan statusCode
    });

    next();
};

async function getSessionId(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    try {
        const token = authHeader.split(' ')[1]; // Bearer <token>
        const tokenRecord = await Token.findOne({
            where: { token, type: 'access' },
        });
        return tokenRecord?.session_id || null;
    } catch (err) {
        console.error('Error extracting session_id:', err);
        return null;
    }
}
