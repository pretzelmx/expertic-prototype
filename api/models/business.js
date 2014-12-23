'use strict';

var mongoose    = require('mongoose'),
    timestamps  = require('mongoose-timestamp'),
    Schema      = mongoose.Schema,
    crypto      = require('crypto');

var businessSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    categories: [
        String
    ],
    name: {
        type: String,
        required: true,
        index: true
    },
    responsible: {
        type: String,
        required: true,
        index: true
    },
    rfc: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    description: {
        type: String
    },
    roles: {
        type: Array,
        default: ['authenticated']
    },
    hashed_password: {
        type: String
    },
    salt: {
        type: String
    }
});

businessSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.hashPassword(password);
}).get(function() {
    return this._password;
});

businessSchema.methods = {
    authenticate: function(text) {
        return this.hashPassword(text) === this.hashed_password;
    },
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },
    hashPassword: function(password) {
        if (!password || !this.salt) {
            return '';
        }
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    },
    toJSON: function() {
        var user = this.toObject();
        delete user.salt;
        delete user.hashed_password;
        return user;
    }
};

businessSchema.plugin(timestamps, {
    createdAt: 'created_at', 
    updatedAt: 'updated_at'
});

module.exports = mongoose.model('Business', businessSchema);
