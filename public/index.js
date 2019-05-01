function postList(){
	let url = './api/blog-posts/list';
	let settings = {
		method : 'GET',
		headers : {
			'Content-Type' : 'application/json'
		}
	};

	fetch(url, settings)
		.then(response => {
			if (response.ok){
				return response.json();
			}
			throw new Error(response.statusText);
		})
		.then(responseJSON => {
			displayPostList(responseJSON);
		})
		.catch(err => {
			console.log(err);
		});
}

function displayPostList(data){

	$('.posts-list').html("");

	for (let i = 0; i < data.posts.length; i ++){
		$('.posts-list').append(`<li>
									Id: ${data.posts[i].id} <br>
									Title: ${data.posts[i].title} <br>
									Content: ${data.posts[i].content} <br>
									Author: ${data.posts[i].author} <br>
									Date published: ${data.posts[i].publishDate} <br>
								  </li>`);
	}

}

function updatePostList(data){
	$('.post-list').append(`<li>
								Id: ${data.posts.id} <br>
								Title: ${data.posts.title} <br>
								Content: ${data.posts.content} <br>
								Author: ${data.posts.author} <br>
								Date published: ${data.posts.publishDate} <br>
							  </li>`);
}

function addNewPost(title, id, content, author){

	let data = {
		title : title,
		id : id,
		content: content,
		author: author
	};

	let url = './api/blog-posts/';
	let settings = {
						method : 'POST',
						headers : {
							'Content-Type' : 'application/json'
						},
						body : JSON.stringify(data)
					};

	fetch(url, settings)
		.then(response => {
			if (response.ok){
				return response.json();
			}
			else{
				return new Promise(function(resolve, reject){
					resolve(response.json());
				})
				.then(data =>{
					throw new Error(data.message);
				})
			}
		})
		.then(responseJSON => {
			postList();
		})
		.catch(err => {
			console.log(err);
		});
}

function editPost(id, title, content, author){

	let data = {
		title : title,
		content: content,
		author: author
	};

	let url = `./api/blog-posts/${id}`;
	let settings = {
						method : 'PUT',
						headers : {
							'Content-Type' : 'application/json'
						},
						body : JSON.stringify(data)
					};

	fetch(url, settings)
		.then(response => {
			if (response.ok){
				return response.json();
			}
			else{
				return new Promise(function(resolve, reject){
					resolve(response.json());
				})
				.then(data =>{
					throw new Error(data.message);
				})
			}
		})
		.then(responseJSON => {
			postList();
		})
		.catch(err => {
			console.log(err);
		});
}

function deletePost(id){

	let url = `./api/blog-posts/${id}`;
	let settings = {
						method : 'DELETE',
						headers : {
							'Content-Type' : 'application/json'
						},
					};

	fetch(url, settings)
		.then(response => {
			if (response.ok){
				return response.json();
			}
			else{
				return new Promise(function(resolve, reject){
					resolve(response.json());
				})
				.then(data =>{
					throw new Error(data.message);
				})
			}
		})
		.then(responseJSON => {
			postList();
		})
		.catch(err => {
			console.log(err);
		});
}

function watchForm(){
	$('.postForm').on('submit', function(event) {
		event.preventDefault();
		let title = $('.postTitle').val();
		let id = $('.postId').val();
		let content = $('.postContent').val();
		let author = $('.postAuthor').val();
		addNewPost(title, id, content, author);
	});

	$('.editForm').on('submit', function(event) {
		event.preventDefault();
		let title = $('.editTitle').val();
		let id = $('.editId').val();
		let content = $('.editContent').val();
		let author = $('.editAuthor').val();
		editPost(id, title, content, author);
	});

	$('.deleteForm').on('submit', function(event) {
		event.preventDefault();
		let id = $('.deleteId').val();
		deletePost(id);
		postList();
	});

}

function init(){
	$(postList);
	$(watchForm);
}

$(init);
