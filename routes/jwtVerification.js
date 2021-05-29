const jwt = require('jsonwebtoken');
const config = require('../config/jwtConfig.js');

verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({
            auth: false,
            message: 'No token provided.'
        });
    } else {
        TokenArray = token.split(" ");
        token = TokenArray[1]

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(500).send({
                    auth: false,
                    message: 'Fail to Authentication. Error -> ' + err
                });
            }
            next();
        });
    }


}

const authJwt = {};
authJwt.verifyToken = verifyToken;
module.exports = authJwt;