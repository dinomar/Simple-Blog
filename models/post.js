'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema({
	title: String,
	body: String,
	published: Boolean,
	created_on: Date,
	updated_on: Date
});

postSchema.pre('save', function() {
	const currentDate = new Date();
	
	this.updated_on = currentDate;
	
	if (!this.created_on) {
		this.created_on = currentDate;
	}
	
	next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;