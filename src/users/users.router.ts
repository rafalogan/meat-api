import * as restfy from 'restify'

import {Router} from "../common/router";
import {User} from "./users.model";

class UsersRouter extends Router {
    applyRoutes(application: restfy.Server) {
        application.get('/users', (req, res, next) => {
            User.findAll().then(users => {
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
        })
    }
}

export const usersRouter = new UsersRouter();
