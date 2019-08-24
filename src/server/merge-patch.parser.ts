import * as restfiy from 'restify';

const mpContentType = 'application/merge-patch+json';

export const mergePatchBodyParser = (req: restfiy.Request, res: restfiy.Response, next) => {
    if (req.getContentType() === mpContentType && req.method === 'PATCH') {
        (<any>req).rawBody = req.body;
        try {
            req.body = JSON.parse(req.body)
        } catch (error) {
            return next(new Error(`invalid content: ${error.message}`))
        }
    }
    return next()
};