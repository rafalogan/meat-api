import {Server} from "./src/server/server";
import {usersRouter} from "./src/users/users.router";
import {restaurantsRouter} from "./src/restaurants/restaurants.router";
import {reviewsRouter} from "./src/reviews/reviews.router";


const server  = new Server();

server.bootstrap([
    usersRouter,
    restaurantsRouter,
    reviewsRouter
]).then(server => console.log('Server is listening on:', server.application.address()))
    .catch(error => {
        console.log('Server failed to start');
        console.log(error);
        process.exit(1)
    });