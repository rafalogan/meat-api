import * as restify from 'restify';
import * as mongoose from 'mongoose';

import {environment} from "../common/environment";
import {Router} from "../common/router";
import {mergePatchBodyParser} from "./merge-patch.parser";
import {handleError} from "./error.handler";
import {tokenParser} from "../security/token.parser";

export class Server {
    application: restify.Server;

    bootstrap(routes: Router[] = []) : Promise<Server> {
        return this.initializeDb().then(() => this.initRoutes(routes).then(() => this));
    }

    shutdown() {
        return mongoose.disconnect()
            .then(() => this.application.close())
    }

    initRoutes(routes: Router[]) : Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });

                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(mergePatchBodyParser);
                this.application.use(tokenParser);

                // routes
                for (let router of routes ) router.applyRoutes(this.application);

                this.application.listen(environment.server.port, () => resolve(this.application));

                this.application.on('restifyError', handleError)
            } catch (error) {
                reject(error);
            }
        });
    }

    initializeDb() : Promise<mongoose.Mongoose> {
        return mongoose.connect(environment.db.url, {
            useCreateIndex: true,
            useNewUrlParser: true
        });
    }
}