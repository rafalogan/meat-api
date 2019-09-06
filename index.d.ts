import {User} from "./src/users/users.model";

declare module 'restify' {
    export interface Request {
        authenticated: User
    }
}