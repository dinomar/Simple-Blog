'use strict';

/*======================================
	Helpers
======================================*/
const PostLen = 300; //max post length before truncate

const truncate = (str) => {
	if (str.length < PostLen) {
		return str;
		}
		
	return str.substring(0, PostLen - 3) + "...";
};

const truncatePosts = (posts) => {
	const tmp = [];
	posts.forEach((post) => {
		post["body"] = truncate(post["body"]);
		tmp.push(post);
	});
	return tmp;
};

const addDate = (posts) => {
	const tmp = [];
	posts.forEach((post) => {
		post["date"] = new Date(post["created_on"]).toDateString();
		tmp.push(post);
	});
	return tmp;
};

const formatTitle = (posts) => {
	const tmp = [];
	posts.forEach((post) => {
		let tArr = post["title"].split(' ');
		let tFirst = tArr[0];
		let tRest = tArr.splice(1).join(' ');
		
		post["title-highlight"] = tFirst;
		post["title-restof"] = tRest;
		tmp.push(post);
	});
	return tmp;
};

module.exports = {
	truncatePosts,
	addDate,
	formatTitle
};