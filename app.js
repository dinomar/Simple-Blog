'use strict';

require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const pug = require('pug');

const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');


//set static resources
app.use(express.static(__dirname + '/assets'));

//use body parser
app.use(bodyParser.urlencoded( {extended: false} ));

//set views
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');


//routes
blogRoutes(app);
adminRoutes(app);


//server
const listener = app.listen(process.env.PORT, () => {
	mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
	console.log('Listening on port ' + listener.address().port);
});