'use strict';

var mongoose    = require('mongoose'),
    timestamps  = require('mongoose-timestamp'),
    Schema      = mongoose.Schema,
    crypto      = require('crypto');

var dependencySchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String
    },
    responsible: {
        type: String,
        required: true,
        index: true
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
});

dependencySchema.plugin(timestamps, {
    createdAt: 'created_at', 
    updatedAt: 'updated_at'
});

module.exports = mongoose.model('Dependency', dependencySchema);
