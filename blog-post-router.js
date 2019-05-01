const express = require('express');
const router = express.Router();
const {ListPosts} = require('./blog-post-model');

router.get('/list', (req, res, next) => {
	ListPosts.get()
		.then( allPosts => {
			res.status(200).json({
				message: "Succesfully retrieved all blog posts",
				status: 200,
				posts: allPosts
			})
		.catch( err => {
			res.status(500).json({
				message: "Internal server error.",
				status: 500
			});
			return next();
		});
	});

});

//Get with author filter
router.get('/:author', (req, res, next) => {
	let authorParam = req.params.author;
	let authorPostsArray = [];

	if (!authorParam) {
		res.status(406).json({
			message: "No author parameter passed.",
			status: 406
		});
		return next();
	}

	let posts = ListPosts.get();
	posts.forEach(item => {
		if(item.author == authorParam){
			authorPostsArray.push(item);
		}
	})

	if(authorPostsArray.length > 0){
		res.status(200).json({
			message: "Posts of the author Succesfully retrieved.",
			status: 200,
			posts: authorPostsArray
		});
	} else {
		res.status(404).json({
			message: "Author not found.",
			status: 404
		});
		return next();
	}
});

//POST to create new blog posts
router.post('/', (req, res, next) => {
	if(!(req.body.id && req.body.title && req.body.content && req.body.author)){
		res.status(406).json({
			message: "Missing body field.",
			status: 406
		});
		return next();
	}

	let newPost = 
	{
		id: req.body.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
	}

	let postedItem = ListPosts.post(newPost);

	res.status(201).json({
		message: "Succesfully added a new blog post.",
		status: 201,
		post: postedItem
	});
});

//DELETE posts based on its id
router.delete('/:id', (req, res, next) => {
	let paramsId = req.params.id;

	if(!paramsId){
		res.status(406).json({
			message: "No id passed in the parameters.",
			status: 406
		});
		return next();
	}

	ListPosts.delete(paramsId)
		.then( deleted => {
			res.status(204).json({
				message: "Post deleted succesfully.",
				status: 204,
				post: deleted
			});
		})
		.catch( err => {
			res.status(404).json({
				message: "Id not found.",
				status: 404
			});
			return next();
		});
});

//PUT request to edit a post based on it's id
router.put('/:id', (req, res, next) => {
	let paramsId = req.params.id;

	if(!paramsId){
		res.status(406).json({
			message: "No id passed in the parameters.",
			status: 406
		});
		return next();
	}

	if(!(req.body.title || req.body.content || req.body.author)){
		res.status(404).json({
			message: "No content passed in the body.",
			status: 404
		});
		return next();
	}

	let editedPost = {
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	};
	
	ListPosts.put(editedPost, paramsId)
		.then( editedPost => {
			res.status(200).json({
				message: "Post updated successfully.",
				status: 200,
				post: editedPost
			});
		})
		.catch( err => {
			res.status(404).json({
				message: "Id not found.",
				status: 404
			});
			return next();
		});
		
});

module.exports = router;
