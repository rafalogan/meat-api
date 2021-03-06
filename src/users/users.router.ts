import * as restfy from 'restify'

import {ModelRouter} from "../common/model-router";
import {User} from "./users.model";

class UsersRouter extends ModelRouter<User> {
    constructor() {
        super(User);
        this.on('beforeRender',
                document => document.password = undefined)
    }

    findByEmail = (req, res, next) => {
       if (req.query.email) {
           User.findByEmail(req.query.email)
               .then(user => user ? [user] : [])
               .then(this.renderAll(res, next, {
                   pageSize: this.pageSize,
                   url: req.url
               }))
               .catch(next)
       } else {
           next()
       }
    };

    applyRoutes(application: restfy.Server) {

        application.get({ path:`${this.basePath}`, version:'2.0.0'}, [this.findByEmail, this.findAll]);
        // application.get({ path:`${this.basePath}`, version:'1.0.0'}, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);

    }
}
export const usersRouter = new UsersRouter();
