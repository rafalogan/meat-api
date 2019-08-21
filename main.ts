import * as restify from 'restify';

const server = restify.createServer({
    name: 'meat-api',
    version: '1.0.0'
});

server.use(restify.plugins.queryParser());

server.get('/info', [
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
    
        res.send({ browser, method, url, path, query })
        return next()
    }
]);

server.listen(3003, () => console.log('API is running on http://localhost:3003'))