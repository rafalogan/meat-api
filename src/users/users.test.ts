import 'jest';
import * as request from 'supertest';

import {Server} from "../server/server";
import {environment} from "../common/environment";
import {usersRouter} from "./users.router";
import {User} from "./users.model";

let localUrl: string;
let server: Server;

beforeAll( () => {
    environment.db.url = process.env.DB_URL || 'mongodb://root:root@localhost/meat-api-test-db?authSource=admin';
    environment.server.port = process.env.SERVER_PORT || 3004;

    localUrl = `http://localhost:${environment.server.port}`;

    server = new Server();
    return  server.bootstrap([usersRouter])
        .then(server => console.log('Server is listening on:', server.application.address()))
        .then(() => User.remove({}).exec())
        .catch(console.error)
});

test('get /users', () => {
   return request(localUrl)
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.items).toBeInstanceOf(Array);
        }).catch(fail);
});

test('post /users', () => {
   return request(localUrl)
       .post('/users')
       .send({
           name: 'User Teste',
           email: 'userteste@teste.com',
           password: '123456',
           cpf: '131.332.721-28'
       }).then(response => {
           expect(response.status).toBe(200);
           expect(response.body._id).toBeDefined();
           expect(response.body.name).toBe('User Teste');
           expect(response.body.email).toBe('userteste@teste.com');
           expect(response.body.password).toBeUndefined();
           expect(response.body.cpf).toBe('131.332.721-28');
       }).catch(fail);
});

test('get /users/aaaa - not found', () => {
    return request(localUrl)
        .get('/users/aaaa')
        .then(response => {
            expect(response.status).toBe(404)
        }).catch(fail);
});

test('patch /users/:id', () => {
    return request(localUrl)
        .post('/users')
        .send({
            name: 'Novo User Teste',
            email: 'novouserteste@teste.com',
            password: '123456'
        }).then(response => request(localUrl)
            .patch(`/users/${response.body._id}`)
            .send({
                name: 'User Patch'
            })
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.body._id).toBeDefined();
                expect(response.body.name).toBe('User Patch');
                expect(response.body.email).toBe('novouserteste@teste.com');
                expect(response.body.password).toBeUndefined();
            })
        ).catch(fail);
});

afterAll(() => server.shutdown());