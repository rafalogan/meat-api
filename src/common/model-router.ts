import * as mongoose from 'mongoose';
import {NotFoundError} from "restify-errors";

import {Router} from "./router";
import {compareSync} from "bcrypt";


export abstract class ModelRouter<D extends mongoose.Document> extends Router {

    basePath: string;
    pageSize: number = 4;

    constructor(protected model: mongoose.Model<D> ) {
        super();
        this.basePath = `/${model.collection.name}`
    }

    protected prepareOne(query: mongoose.DocumentQuery<D,D>): mongoose.DocumentQuery<D,D> {
        return query;
    }

    envelope(document: any): any {
        let resource = Object.assign({
            _links: {}
        }, document.toJSON());

        resource._links.self = `${this.basePath}/${resource._id}`;
        return resource;
     }

     envelopeAll(documents: any[], options: any = {}): any {
        const completOptions = options.currentPage && options.count && options.pageSize;
        const remaining = options.count - (options.currentPage * options.pageSize);
        const resource: any = {
            _links: {
                self: `${options.url}`
            },
            items: documents
        };

        if(completOptions && options.currentPage > 1)
            resource._links.previous = `${this.basePath}?_page=${options.currentPage - 1}`;
        if (completOptions && remaining > 0)
            resource._links.next = `${this.basePath}?_page=${options.currentPage + 1}`;
        return resource
     }

    validateId = (req, res, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) next(new NotFoundError('Document not found!'));

        next()
    };

    findAll = (req, res, next) => {
        const page = parseInt(req.query._page || 1);
        const currentPage = (page > 0) ? page : 1;
        const skip = (currentPage - 1) * this.pageSize;
        const pageSize = this.pageSize;
        const url = req.url;

        this.model.count({}).exec()
            .then(count => this.model.find().skip(skip)
            .limit(this.pageSize)
            .then(this.renderAll(res, next, {
                currentPage,
                count,
                pageSize,
                url})
            )).catch(next)
    };

    findById = (req, res, next) => {
       this.prepareOne(this.model.findById(req.params.id))
            .then(this.render(res, next))
            .catch(next)
    };

    save = (req, res, next) => {
        let document = new this.model(req.body);
        document.save().then(this.render(res, next))
            .catch(next)
    };

    replace = (req, res, next) => {
        const options = { runValidators: true, overwrite: true };
        this.model.update({_id: req.params.id}, req.body, options).exec()
            .then(result => {
                if (result.n) return this.model.findById(req.params.id);
                new NotFoundError('Documento não encontrado!')
            }).then(this.render(res, next))
            .catch(next)
    };

    update = (req, res, next) => {
        const options = { runValidators: true, new: true };

        this.model.findByIdAndUpdate(req.params.id, req.body, options)
            .then(this.render(res, next))
            .catch(next)
    };

    delete = (req, res, next) => {
        this.model.remove({_id: req.params.id}).exec()
            .then(result => {
                if (result.n) {
                    res.send(204)
                } else {
                    new NotFoundError('Documento não encontrado!')
                }
                return next()
            }).catch(next)
    }
}