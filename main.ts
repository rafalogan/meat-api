import * as restify from 'restify';

const server = restify.createServer({
    name: 'meat-api',
    version: '1.0.0'
});


server.get('/hello', (req, res, next) => {
    res.json({message: 'Hello World!'})
    return next()
});

server.listen(3003, () => console.log('API is running on http://localhost:3003'))