'use strict';
const Post = require('../models/post');

const PostLen = 300; //max post length before truncate 


const truncate = (str) => {
	if (str.length < PostLen) {
		return str;
	}
	
	return str.substring(0, PostLen - 3) + "...";
};

const truncatePosts = (posts) => {
	const temp = [];
	
	posts.forEach((post) => {
		post["body"] = truncate(post["body"]);
		temp.push(post);
	});
	return temp;
};

const formatDate = (posts) => {
	const temp = [];
	
	posts.forEach((post) => {
		let date = new Date(post["created_on"]);
		let dateString = date.toDateString();
		
		post["date"] = dateString;
		temp.push(post);
	});
	return temp;
};

const formatTitle = (posts) => {
	const temp = [];
	
	posts.forEach((post) => {
		let tArr = post["title"].split(' ');
		let tFirst = tArr[0];
		let tRest = tArr.splice(1).join(' ');
		
		post["title-highlight"] = tFirst;
		post["title-restof"] = tRest;
		temp.push(post);
	});
	return temp;
};

const formatPosts = (posts) => {
	posts = truncatePosts(posts);
	posts = formatTitle(posts);
	posts = formatDate(posts);
	return posts;
};

const formatFullPost = (posts) => {
	posts = formatTitle(posts);
	posts = formatDate(posts);
	return posts;
};

const formatAllPosts = (posts) => {
	posts = formatTitle(posts);
	posts = formatDate(posts);
	return posts;
};

const pagination = (posts, page) => {
	return posts.slice((9 * (page - 1) + 1), (9 * page) + 1);
};

const create = (title, body, publish, next) => {
	//create new post
	const post = new Post({
		title: title,
		body: body,
		published: publish
	});
	
	//save post
	post.save((err, post) => {
		if (err) {
			return next(err);
		}
		
		return next(null, post);
	});
};

const get = (page, next) => {
	const selects = {_id: 1, title: 1, body: 1, created_on: 1};
	Post.find({ published: true })
	.select(selects)
	.sort({ created_on: -1})
	.exec((err, posts) => {
		if (err) {
			return next(err);
		}
		
		if (page > 1 && posts.length > 10) {
			return next(null, pagination(formatPosts(posts), page));
		}
		
		return next(null, formatPosts(posts).splice(0, 10));
	});
};

const getAll = (next) => {
	const selects = {_id: 1, title: 1, created_on: 1};
	Post.find({})
	.select(selects)
	.sort({ created_on: -1})
	.exec((err, posts) => {
		if (err) {
			return next(err);
		}
		
		return next(null, formatAllPosts(posts));
	});
};

const getFull = (id, next) => {
	const selects = {_id: 1, title: 1, body: 1, created_on: 1};
	Post.find({ _id: id})
	.select(selects)
	.limit(1)
	.exec((err, post) => {
		if (err) {
			return next(err);
		}
		
		return next(null, formatFullPost(post));
	});
};

const edit = (id, title, body, next) => {
	Post.updateOne({ _id: id }, { title: title, body: body }, (err, res) => {
		if (err) {
			return next(err);
		}
		
		return next(null, res);
	});
};

const del = (id, next) => {
	Post.deleteOne({ _id: id }, (err) => {
		if (err) {
			return next(err);
		}
		return next(null);
	});
};

const search = (page, search, next) => {
	const selects = {_id: 1, title: 1, body: 1, created_on: 1};
	Post.find({ 'title' : new RegExp(search, 'i'), published: true })
	.select(selects)
	.exec((err, posts) => {
		if (err) {
			return next(err);
		}
		
		if (page > 1 && posts.length > 10) {
			return next(null, pagination(formatPosts(posts), page));
		}
		
		return next(null, formatPosts(posts).splice(0, 10));
	});
};

module.exports = {
	create,
	get,
	search,
	getFull,
	getAll,
	del
};