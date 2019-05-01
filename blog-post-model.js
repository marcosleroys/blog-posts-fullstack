const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let postSchema = mongoose.Schema({
	id : {type : Number, required : true, unique : true},
	title : {type : String, required : true},
	content: {type : String, required : true},
	author: {type : String, required : true},
	publishDate: {type : Date, default : Date.now}
});

let Posts = mongoose.model('Posts', postSchema);

const ListPosts = {
	get : function(){
		return Posts.find()
			.then(posts => {
				return posts;
			})
			.catch(err => {
				throw new Error(err);
			});
	},
	post : function(item){
		return Posts.create(item)
			.then(post => {
				return post;
			})
			.catch(err => {
				throw new Error(err);
			});
	},
	delete : function(id){
		return Posts.findOneAndDelete({"id" : id}, {projection: {"id" : 1, "title" : 1, "author" : 1}})
			.then(post => {
				return post;
			})
			.catch(err => {
				throw new Error(err);
			});
	},
	put : function(edited, id){
		return Posts.findOneAndUpdate({"id": id}, {"title": edited.title, "content": edited.content, "author": edited.author}, {new : true})
	}
}

module.exports = {ListPosts};
