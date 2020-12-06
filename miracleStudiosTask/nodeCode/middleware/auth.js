const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const moment = require('moment');
const users = require('../models').user;
const config = require('../config/config.json');

//user authentication and redirection
router.use(async (req, res, next) => {
    try {
        // check header or url parameters or post parameters for token
        let token = req.headers['token'];
        // decode token
        if (token) {
            jwt.verify(token, config.secret, {
                ignoreExpiration: true
            }, async (err, decoded) => {
                if (err) {
                    console.log(err);
                    res.status(400).send({ status: 0, message: 'Your session has expired ,please signin again' });
                } else {
                    try {
                        req.decoded = decoded;
                        let curentTimestamp = moment().utc().unix();
                        //verify token wheather user exist or not
                        let adminData = await users.findOne({ where: [{ id: decoded.id, is_deleted: 0,type:2 }] });
                        if (adminData == null){
                            return next({ status: 401, message: "User authentication failed,please signin again" });
                        }
                        await users.update({ last_login: curentTimestamp }, { where: { id:  decoded.id} })
                        req.decoded.firstName = adminData.fisrName;
                        req.decoded.lastName = adminData.lastName;
                        req.decoded.email = adminData.email;
                        req.decoded.created_at = adminData.created_at;
                        next();
                    } catch (err) {
                        console.log(err);
                        return next({ message: err.message });
                    }
                }
            });
        } else {
            // if there is no token return an error
            return next({ status: 401, message: 'No token provided' });
        }
    } catch (err) {
        return next({ message: err.message });
    }
});

module.exports = router;
