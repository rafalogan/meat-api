import * as restify from 'restify';
import * as jwt from 'jsonwebtoken';
import {NotAuthorizedError} from "restify-errors";

import {User} from "../users/users.model";
import {environment} from "../common/environment";

export const authenticate: restify.RequestHandler = (req, res, next) => {
    const { email, password } = req.body;

    User.findByEmail(email, '+password')
        .then(user => {
            if (user && user.matches(password)) {
                const sub = user.email;
                const iss = 'meat-api';
                const accessToken = jwt.sign({sub, iss }, environment.security.apiSecret);
                const name = user.name;

                res.json({ name, email, accessToken });
                return next(false)
            } else {
                return next(new NotAuthorizedError('Invalid Credentials'))
            }
        }).catch(next);
};