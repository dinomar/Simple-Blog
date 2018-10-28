'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/*======================================
	Schema
======================================*/
const postSchema = new Schema({
	title: String,
	body: String,
	published: Boolean,
	created_on: Date,
	updated_on: Date
});


/*======================================
	Helpers
======================================*/
const pagination = (posts, page) => {
	return posts.slice((9 * (page - 1) + 1), (9 * page) + 1);
};

	
/*======================================
	Statics
======================================*/
//edit post
postSchema.statics.edit = function(id, title, body, published, next) {
	const query = { _id: id };
	const options = { title: title, body: body, published: published };
	this.updateOne(query, options, (err, result) => {
		if(err) {
			return next(err);
		}
		
		return next(null, result);
	});
}; 


//search posts
postSchema.statics.search = function(page, search, next) {
	const query = { 'title' : new RegExp(search, 'i'), published: true };
	const selects = {_id: 1, title: 1, body: 1, created_on: 1};
	this.find(query)
	.select(selects)
	.exec((err, posts) => {
		if (err) {
			return next(err);
		}
		
		if (page > 1 && posts.length > 10) {
			return next(null, pagination(posts, page));
		}
		
		return next(null, posts.splice(0, 10));
	});
};


//get single post
postSchema.statics.getSingle = function(id, next) {
	const query = { _id: id };
	const selects = {_id: 1, title: 1, body: 1, created_on: 1, published: 1};
	this.find(query)
	.select(selects)
	.limit(1)
	.exec((err, posts) => {
		if (err) {
			return next(err);
		}
		
		return next(null, posts);
	});
};


//get list of all posts, sort by recent(created_on)
postSchema.statics.getAll = function(next) {
	const query = {};
	const selects = {_id: 1, title: 1, created_on: 1, published: 1};
	this.find(query)
	.select(selects)
	.sort({ created_on: -1})
	.exec((err, posts) => {
		if (err) {
			return next(err);
		}
		
		return next(null, posts);
	});
};


//get all posts paged, sort by recent(created_on)
postSchema.statics.getPaged = function(page, next) {
	const query = { published: true };
	const selects = {_id: 1, title: 1, body: 1, created_on: 1};
	this.find(query)
	.select(selects)
	.sort({ created_on: -1})
	.exec((err, posts) => {
		if (err) {
			return next(err);
		}
		
		if (page > 1 && posts.length > 10) {
			return next(null, pagination(posts, page));
		}
		
		return next(null, posts.splice(0, 10));
	});
};



/*======================================
	Middleware
======================================*/
//add date to post
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