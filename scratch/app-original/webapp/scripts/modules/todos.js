$.fn.startTodos = function() {

	var app_id = 'railroad-hashmarks-e6f';
	var simperium = new Simperium(app_id, {
		token: '16723ee1bf6d499b9ffbc024ff30aeac'
	});
	var bucket = simperium.bucket("todo");

	// https://simperium.com/docs/reference/js/
	// can keep track of these objects in a simple dictionary or array or a Backbone.Collection
	// Backbone basically binds a view to a model, so that when you update the model, the view changes automatically

	// when an object is updated remotely, simperium will notify us
	// Whenever we get a notify event, we should look up the id and update the object (as well as any UI). 
	bucket.on('notify', function(id, data) {
		console.log("object " + id + " was updated!");
		console.log("new data is:");
		console.log(data);

		// normally we would search out the object with a matching id, and if none, only then would we add it

		// grab a template
		var compiledTemplate = Handlebars.templates['todo'];
		var html = compiledTemplate(data);
		$('#todos .list').append(html);

	});

	// implement the local callback so that Simperium can fetch the local state of an object at any time.
	bucket.on('local', function(id) {
		console.log("request for local state for object " + id + " received");
		// normally would go look for this object and return its json 
		// simperium is just checking to see what changes there are, within the object
		// for brand new objects, you should return its json	
		var data = {"done": false, "order" : 0, "title": "Just testing"};

		return data;
	});

	// Whenever an object is changed locally we must call update on the bucket to save it. 

	// start her up
	bucket.start();

    var S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

	// add a button
	$("#addTodo").click(function() {
		var id = S4()+S4()+S4()+S4()+S4();
		var data = {"done": false, "order" : 0, "title": "Just testing"};
		bucket.update(id, data);

		// it will be available on next refresh, but we get no remote notification, so have to do it ourselves
		var compiledTemplate = Handlebars.templates['todo'];
		var html = compiledTemplate(data);
		$('#todos .list').append(html);

	});

	// // Create our global collection of **Todo**.
	// var todoList = new TodoList([], {
	// 	bucket: todoBucket
	// });
	// todoList.fetch();

	// var done = todoList.done().length;
	// var remaining = todoList.remaining().length;

	// alert("done: " + done);


	// the non-backbone way would be 
	//  1. to create an array
	//  2. load in objects from localstorage
	//  3. display them
	//  4. listen for remote changes
	//  5. listen for local changes 
	//  6. when creating new, add to the array with a unique id and then call update on the bucket - local listener will send back the new data

}