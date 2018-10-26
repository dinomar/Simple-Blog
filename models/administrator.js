'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const Schema = mongoose.Schema;
const adminSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
});


//authenticate session
adminSchema.statics.authenticate = function(username, password, next) {
	this.findOne( {username: username} )
		.exec((err, user) => {
			if(err || !user) {
				return next(err);
			}
			
			bcrypt.compare(password, user.password, (err, result) => {
				if(err || result !== true) {
					return next(err);
				}
				
				return next(null, user);
			});
		});
};

//hash password before saving
adminSchema.pre('save', function(next) {
	bcrypt.hash(this.password, 10, (err, hash) => {
		if(err) {
			return next(err);
		}
		this.password = hash;
		next();
	});
});


const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;