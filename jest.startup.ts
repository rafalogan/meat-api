import * as jestCli from 'jest-cli';

import {environment} from "./src/common/environment";
import {Server} from "./src/server/server";
import {usersRouter} from "./src/users/users.router";
import {User} from "./src/users/users.model";
import {reviewsRouter} from "./src/reviews/reviews.router";
import {Review} from "./src/reviews/reviews.model";
import {restaurantsRouter} from "./src/restaurants/restaurants.router";
import {Restaurant} from "./src/restaurants/restaurants.model";

let localUrl: string;
let server: Server;

const beforeAllTests = () => {
    environment.db.url = process.env.DB_URL || 'mongodb://root:root@localhost/meat-api-test-db?authSource=admin';
    environment.server.port = process.env.SERVER_PORT || 3004;

    localUrl = `http://localhost:${environment.server.port}`;

    server = new Server();
    return  server.bootstrap([
        usersRouter,
        reviewsRouter,
        restaurantsRouter
    ]).then(server => console.log('Server is listening on:', server.application.address()))
        .then(() => User.remove({}).exec())
        .then(() => Review.remove({}).exec())
        .then(() => Restaurant.remove({}).exec())
};

const afterAllTests = () => server.shutdown();

beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error);