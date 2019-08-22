import * as restify from "restify";

import {environment} from "../common/environment";

export class Server {
    application: restify.Server;

    bootstrap(): Promise<Server> {
        return this.initRoutes().then(() => this);
    }

    initRoutes(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });

                this.application.use(restify.plugins.queryParser());

                // routes
                this.application.get('/info', [
                    (req, res, next) => {
                        if(req.userAgent() && req.userAgent().includes('MSIE 7.0')){
                            let error: any = new Error();
                            error.statusCode = 400;
                            return next(false)
                        }
                        return next();
                    },
                    (req, res, next) => {
                        const browser = req.userAgent();
                        const method = req.method;
                        const url = req.href();
                        const path = req.path();
                        const query = req.query;

                        res.send({ browser, method, url, path, query });
                        return next()
                    }
                ]);

                this.application.listen(environment.server.port, () => resolve(this.application));
            } catch (error) {
                reject(error);
            }
        });
    }
}