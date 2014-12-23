'use strict';

var mongoose    = require('mongoose'),
    timestamps  = require('mongoose-timestamp'),
    Schema      = mongoose.Schema,
    crypto      = require('crypto');

// mongoose.set('debug', true);

var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    extract: {
        type: String
    },
    firstname: {
        type: String,
        required: true,
        index: true
    },
    lastname: {
        type: String,
        required: true,
        index: true
    },
    dependency: {
        type: Schema.Types.ObjectId,
        ref: 'Dependency',
        required: true,
        index: true
    },
    area: {
        type: String,
        required: true,
        index: true
    },
    job: {
        type: String,
        required: true,
        index: true
    },
    // Meses
    time_working: {
        type: Number
    },
    social_network: {
        type: String
    },
    studies: [{
            title: String,
            description: String
        }
    ],
    skills: [String],
    trainings: [{
            title: String,
            description: String
        }
    ],
    career: [{
            title: String,
            time_working: Number,
            sector: String,
            description: String
        }
    ],
    interests: [String],
    courses: [{
            type: Schema.Types.ObjectId,
            ref: 'Course',
            index: true
        }
    ],
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

userSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.hashPassword(password);
}).get(function() {
    return this._password;
});

userSchema.methods = {
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

userSchema.plugin(timestamps, {
    createdAt: 'created_at', 
    updatedAt: 'updated_at'
});

module.exports = mongoose.model('User', userSchema);
