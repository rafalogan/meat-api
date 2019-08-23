import * as restfy from 'restify'

import {Router} from "../common/router";
import {User} from "./users.model";

class UsersRouter extends Router {
    applyRoutes(application: restfy.Server) {
        application.get('/users', (req, res, next) => {
            User.find().then(users => {
                res.json(users);
                return next()
            })
        });

        application.get('/users/:id', (req, res, next) => {
            const id  = parseInt(req.params.id);

            User.findById(id).then(user => {
                if (user) {
                    res.json(user);
                    next()
                } else  {
                    res.send(400);
                }
            })
        });

        application.post('/users', (req, res, next) => {
            let user = new User(req.body);
            user.save().then(user => {
                user.password = undefined;
                res.json(user);
                next()
            })
        })
    }
}

export const usersRouter = new UsersRouter();
