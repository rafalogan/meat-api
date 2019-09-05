import 'jest';
import * as request from 'supertest';

let localUrl: string = (<any>global).testUrl;

test('get /reviews', () => {
    return request(localUrl)
        .get('/reviews')
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
});