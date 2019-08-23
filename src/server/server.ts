import * as restify from 'restify';
import * as mongoose from 'mongoose';

import {environment} from "../common/environment";
import {Router} from "../common/router";

export class Server {
    application: restify.Server;

    bootstrap(routes: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() => this.initRoutes(routes).then(() => this));
    }

    initRoutes(routes: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });

                this.application.use(restify.plugins.queryParser());

                // routes
                for (let router of routes ) router.applyRoutes(this.application);

                this.application.listen(environment.server.port, () => resolve(this.application));
            } catch (error) {
                reject(error);
            }
        });
    }

    initializeDb() {
        return mongoose.connect(environment.db.url, {
            useCreateIndex: true,
            useNewUrlParser: true
        });
    }
}