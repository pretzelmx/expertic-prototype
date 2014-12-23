'use strict';

var mongoose 	= require('mongoose'),
	timestamps 	= require('mongoose-timestamp'),
	Schema 		= mongoose.Schema;

var sessionSchema = new Schema({
	user: { 
		type: Schema.Types.ObjectId,
		ref: 'User',
		index: true
	}
});

sessionSchema.plugin(timestamps, {
    createdAt: 'created_at', 
    updatedAt: 'updated_at'
});

module.exports = mongoose.model('Session', sessionSchema);
