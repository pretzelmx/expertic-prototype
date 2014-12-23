'use strict';

var mongoose    = require('mongoose'),
    timestamps  = require('mongoose-timestamp'),
    Schema      = mongoose.Schema,
    crypto      = require('crypto');

var courseSchema = new Schema({
    folio: {
        type: String,
        required: true,
        index: true
    },
    name: {
    	type: String,
        required: true,
        index: true
    },
    description: {
    	type: String
    },
    business: {
    	type: Schema.Types.ObjectId,
        ref: 'Business',
        index: true
    },
 	category: {
    	type: String,
    	index: true,
    	enum: [
        	'desarrollo',
        	'infraestructura',
        	'telecomunicaciones',
        	'soporte',
        	'seguridad',
        	'otros'
    	],
    	default: 'otros'
    },
    hours: {
    	type: Number,
    	required: true
    },
    format: {
    	type: String,
    	required: true,
    	index: true,
    	enum: [
        	'online',
        	'presencial'
    	],
    	default: 'online'
    },
    attendes: {
    	type: Array
    },
    status: {
    	type: String,
    	index: true,
    	enum: [
        	'nuevo',
        	'iniciado',
        	'terminado'
    	],
    	default: 'nuevo'
    }
});

courseSchema.plugin(timestamps, {
    createdAt: 'created_at', 
    updatedAt: 'updated_at'
});

module.exports = mongoose.model('Course', courseSchema);
