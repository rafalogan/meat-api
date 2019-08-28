import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

import {validateCPF} from "../common/validators";
import {environment} from "../common/environment";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        required: true
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validateCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    }
});

const hashPassword = (object, next) => {
    bcrypt.hash(object.password, environment.security.saltRounds)
        .then(hash=>{
            object.password = hash;
            next()
        }).catch(next)
};

const saveMiddleware = function (next){
    const user: User = this;
    if(!user.isModified('password')){
        next()
    }else{
        hashPassword(user, next)
    }
};

const updateMiddleware = function (next){
    if(!this.getUpdate().password){
        next()
    }else{
       hashPassword(this.getUpdate(), next)
    }
};

userSchema.pre('save', saveMiddleware);
userSchema.pre('findOneAndUpdate', updateMiddleware);
userSchema.pre('update', updateMiddleware);


export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string
}

export const User = mongoose.model<User>('User', userSchema);