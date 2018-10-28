'use strict';
const bodyParser = require('body-parser');
//const postHandler = require('../modules/postHandler');
const Post = require('../models/post');
const helpers = require('../modules/helpers.js');


/*
/
GET | Return home page with posts
    |postHandler.get

/search
GET | return home page with search results
    |postHandler.search

/full
GET | return full-article with full post
    |postHandler.getFull
*/


module.exports = function (app) {

	app.route('/')
	
		.get((req, res) => {
			let page = 1;
			if(req.query.page) {
				page = req.query.page;
			}
			
			Post.getPaged(page, (err, posts) => {
				if (err) {
					console.log(err);
					const options = {
						posts: [],
						errorMessage: "Error: could not load any posts.",
						nextPage: "#"
					};
					return res.render('home', options); 
				}
				
				posts = helpers.truncatePosts(posts);
				posts = helpers.addDate(posts);
				posts = helpers.formatTitle(posts);
				
				const options = {
					posts: posts,
					errorMessage: "No posts",
					nextPage: "/?page=" + (page + 1)
				};
				return res.render('home', options);
			});
		});
		
		
	app.route('/results') // search
	
		.get((req, res) => {
			let page = 1;
			if(req.query.page) {
				page = req.query.page;
			}
			
			let q = "";
			if(req.query.q) {
				q = req.query.q;
			}
			
			Post.search(page, q, (err, posts) => {
				if (err) {
					console.log(err);
					const options = {
						posts: [],
						errorMessage: "Error: could not load any posts.",
						nextPage: ""
					};
					return res.render('home', options);
				}
				
				posts = helpers.truncatePosts(posts);
				posts = helpers.addDate(posts);
				posts = helpers.formatTitle(posts);
				
				const options = {
					posts: posts,
					errorMessage: "No posts",
					nextPage: "/results?page=" + (page + 1)
				};
				return res.render('home', options);
			});
		});
		
		
	app.route('/full')
	
		.get((req, res) => {
			if(!req.query.id) {
				const options = {
					posts: [],
					errorMessage: "Error: No article to load."
				};
				return res.render('home', options);
			}
			
			Post.getSingle(req.query.id, (err, posts) => {
				if (err) {
					console.log(err);
					const options = {
						posts: [],
						errorMessage: "Error: could not load article."
					};
					return res.render('home', options);
				}
				
				posts = helpers.addDate(posts);
				posts = helpers.formatTitle(posts);
				
				const options = {
					posts: posts,
					errorMessage: "Not found"
					};
				return res.render('full-article', options);
			});
		});

}