import * as restify from 'restify';
import {EventEmitter} from 'events';

export abstract class Router extends EventEmitter {
    abstract applyRoutes(application: restify.Server);

    render(res: restify.Response, next: restify.Next) {
        return document => {
            if (document) {
                this.emit('beforeRender', document);
                res.json(document)
            } else {
                res.send(404)
            }
            return next()
        }
    }
}