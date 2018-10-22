'use strict';
const bodyParser = require('body-parser');
const postHandler = require('../modules/postHandler');

module.exports = function (app) {

	app.route('/')
	
		.get((req, res) => {
			let page = 1;
			if(req.query.page) {
				page = req.query.page;
			}
			postHandler.get(page, (err, posts) => {
				if (err) {
					console.log(err);
					return res.render('home', { posts: [], errorMessage: "Error: could not load any posts.", nextPage: "#" }); 
				}
				
				// return posts
				const nextPage = "/?page=" + (page + 1);
				return res.render('home', { posts: posts, errorMessage: "No posts", nextPage: nextPage });
			});
		});
		
		
	app.route('/search')
	
		.get((req, res) => {
			let page = 1;
			if(req.query.page) {
				page = req.query.page;
			}
			
			let q = "";
			if(req.query.q) {
				q = req.query.q;
			}
			
			postHandler.search(page, q, (err, posts) => {
				if (err) {
					console.log(err);
					return res.render('home', { posts: [], errorMessage: "Error: could not load any posts.", nextPage: "" });
				}
				
				// return posts
				const nextPage = "/search?page=" + (page + 1);
				return res.render('home', { posts: posts, errorMessage: "No posts", nextPage: nextPage });
			});
		})
		
		.post((req, res) => {
			
		})
		
		.put((req, res) => {
			
		})
		
		.delete((req, res) => {
			
		});
		
		
	app.route('/full')
	
		.get((req, res) => {
			if(!req.query.id) {
				return res.render('home', { posts: [], errorMessage: "Error: No article to load." });
			}
			
			postHandler.getFull(req.query.id, (err, post) => {
				if (err) {
					console.log(err);
					return res.render('home', { posts: [], errorMessage: "Error: could not load article." });
				}
				
				return res.render('full-article', { posts: post, errorMessage: "Not found" });
			});
		})
		
		.post((req, res) => {
			
		})
		
		.put((req, res) => {
			
		})
		
		.delete((req, res) => {
			
		});

}