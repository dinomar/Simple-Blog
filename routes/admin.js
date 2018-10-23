'use strict';
const postHandler = require('../modules/postHandler');

module.exports = function (app) {

	app.route('/admin')
	
		.get((req, res) => {
			postHandler.getAll((err, posts) => {
				if (err) {
					console.log(err);
					return res.render('admin-posts', { selected: "posts", posts: [] });
				}
				
				// return posts
				return res.render('admin-posts', { selected: "posts", posts: posts });
			});
		})
		
		.post((req, res) => {
			
		})
		
		.put((req, res) => {
			
		})
		
		.delete((req, res) => {
			
		});
		
		
	app.route('/admin/editor')
	
		//Return post for editor to edit | return editor || return editor with post
		.get((req, res) => {
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
		.post((req, res) => {
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
		.put((req, res) => {
			//update
		})
		
		//Delete post | return json
		.delete((req, res) => {
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
		

	app.route('/posts')
	
		.get((req, res) => {
			//return res.render('admin-editor', {});
		})
		
		.post((req, res) => {
			
		})
		
		.put((req, res) => {
			
		})
		
		.delete((req, res) => {
			
		});

}