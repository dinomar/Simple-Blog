'use strict';
const postHandler = require('../modules/postHandler');
const Admin = require('../models/administrator');

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
			postHandler.getList((err, posts) => {
				if (err) {
					console.log(err);
					return res.render('admin-posts', { selected: "posts", posts: [] });
				}
				
				// return posts
				return res.render('admin-posts', { selected: "posts", posts: posts });
			});
		});
		
		
	app.route('/admin/editor')
	
		//Return post for editor to edit | return editor || return editor with post
		.get(requiresLogin, (req, res) => {
			if(!req.query.id) {
				return res.render('admin-editor', { post: {}, edit: false });
			}
			
			postHandler.getFull(req.query.id, (err, post) => {
				if (err) {
					console.log(err);
					return res.render('admin-editor', { post: {} });
				}
				
				return res.render('admin-editor', { post: post[0], edit: true });
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
			
			postHandler.create(req.body.title, req.body.body, req.body.publish, (err, post) => {
				if (err) {
					console.log(err);
					return res.json({});
				}
				return res.json(post);
			});
		})
		
		//Update post from editor
		.put(requiresLogin, (req, res) => {
			if(!req.body.id || !req.body.title || !req.body.body || !req.body.publish) {
				return res.json({}); // msg : error missing paramaters
			}
			
			postHandler.edit(req.body.id, req.body.title, req.body.body, req.body.publish, (err, post) => {
				if (err) {
					console.log(err);
					return res.json({});
				}
				
				return res.json(post);
			});
		})
		
		//Delete post | return json
		.delete(requiresLogin, (req, res) => {
			if(!req.body.id) {
				return res.json({});
			}
			
			postHandler.del(req.body.id, (err) => {
				if (err) {
					console.log(err);
					return res.json({});
				}
				
				return res.json({ message: "OK" });
			});
		});
		

	app.route('/admin/login')
	
		.get((req, res) => {
			return res.render('login', {});
		})
		
		.post((req, res) => {
			if(!req.body.username || !req.body.password) {
				console.log("missing params!");
				return res.render('login', {});
			}
			
			Admin.authenticate(req.body.username, req.body.password, (err, user) => {
				if(err || !user) {
					return res.render('login', {});
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
					return err;
				}
				return res.redirect('/');
			});
		});
		
		
	app.route('/admin/create')
	
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
		});

}