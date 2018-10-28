'use strict';
const Post = require('../models/post');
const Admin = require('../models/administrator');
const helpers = require('../modules/helpers.js');

/*
/admin
GET   | Return Administration page on posts tab
      | postHandler.getList


/admin/editor
GET   | Return Editor
      | Return Editor with post to edit
	  | postHandler.getFull

POST  | Create new post, return json
      | postHandler.create

PUT   | Update post from editor, return json
      | postHandler.edit

Delete| Delete post, return json
      | postHandler.del


/admin/login
GET   | Return login page
*/

const requiresLogin = (req, res, next) => {
	if(req.session && req.session.userId) {
		return next();
	}
	return res.redirect('/admin/login');
};

module.exports = function (app) {

	app.route('/admin')
	
		.get(requiresLogin, (req, res) => {
			
			Post.getAll((err, posts) => {
				if (err) {
					console.log(err);
					const options = {
						selected: "posts",
						posts: []
						};
					return res.render('admin-posts', options);
				}
				
				posts = helpers.addDate(posts);
				posts = helpers.formatTitle(posts);
				
				const options = {
					selected: "posts",
					posts: posts
					};
				return res.render('admin-posts', options);
			});
		});
		
		
	app.route('/admin/editor')
	
		//Return post for editor to edit | return editor || return editor with post
		.get(requiresLogin, (req, res) => {
			if(!req.query.id) {
				const options = {
					post: {},
					edit: false
				};
				return res.render('admin-editor', options);
			}
			
			Post.getSingle(req.query.id, (err, posts) => {
				if (err) {
					console.log(err);
					const options = {
						post: {}
					};
					return res.render('admin-editor', options);
				}
				
				posts = helpers.addDate(posts);
				posts = helpers.formatTitle(posts);
				
				const options = {
					post: posts[0],
					edit: true
				};
				return res.render('admin-editor', options);
			});
		})
		
		//Create new Post | return json
		.post(requiresLogin, (req, res) => {
			if(!req.body.title || !req.body.body) {
				return res.json({});
			}
			
			let publish = false;
			if (req.body.publish) {
				publish = req.body.publish;
			}
			
			const post = new Post({
				title: req.body.title,
				body: req.body.body,
				published: publish
			});
			
			post.save((err, result) => {
				if (err) {
					console.log(err);
					return res.json({});
				}
				
				return res.json(result);
			});
		})
		
		//Update post from editor
		.put(requiresLogin, (req, res) => {
			if(!req.body.id || !req.body.title || !req.body.body || !req.body.publish) {
				return res.json({}); // msg : error missing paramaters
			}
			
			Post.edit(req.body.id, req.body.title, req.body.body, req.body.publish, (err, result) => {
				if (err) {
					console.log(err);
					return res.json({}); // msg : error
				}
				
				return res.json(result);
			});
		})
		
		//Delete post | return json
		.delete(requiresLogin, (req, res) => {
			if(!req.body.id) {
				return res.json({}); // msg : error missing paramaters
			}
			
			Post.deleteOne({ _id: req.body.id }, (err) => {
				if (err) {
					console.log(err);
					return res.json({}); // msg : error
				}
				
				return res.json({ message: "OK" }); // msg : msg ok
			});
		});
		

	app.route('/admin/login')
	
		.get((req, res) => {
			return res.render('login', {});
		})
		
		.post((req, res) => {
			if(!req.body.username || !req.body.password) {
				console.log("Login: missing params!");
				return res.render('login', {});
				//return res.json({}); // msg : error
			}
			
			Admin.authenticate(req.body.username, req.body.password, (err, user) => {
				if(err || !user) {
					return res.render('login', {});
					//return res.json({}); // msg : error username, pass incorrect.
				}
				
				req.session.userId = user._id;
				return res.redirect('/admin');
			});
		});
		
	
	app.route('/admin/logout')
	
		.get((req, res) => {
			if(!req.session) {
				return res.redirect('/');
			}
			
			req.session.destroy((err) => {
				if(err) {
					console.log(err);
					throw err;
				}
				return res.redirect('/');
			});
		});
		
		
	/* app.route('/admin/create')
	
		.get((req, res) => {
			//create admin user
			const admin = new Admin({
				username: "admin",
				email: "dinoalcatel@gmail.com",
				password: "root"
			});
			
			admin.save((err, user) => {
				if(err) {
					console.log(err);
					return res.json({});
				}
				return res.json(user);
			});
		}); */

}