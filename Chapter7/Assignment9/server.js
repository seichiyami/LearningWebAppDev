// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */ 

var express = require("express"),
    http = require("http"),
    // import the mongoose library
    mongoose = require("mongoose"),
    app = express(),
    // assignment7
    server = http.createServer(app),
    socketIO = require("socket.io"),
    io = socketIO(server);

app.use(express.static(__dirname + "/client"));
app.use(express.bodyParser());

// connect to the amazeriffic data store in mongo
mongoose.connect("mongodb://localhost/amazeriffic");

// This is our mongoose model for todos
var ToDoSchema = mongoose.Schema({
    description: String,
    tags: [ String ]
});

var ToDo = mongoose.model("ToDo", ToDoSchema);


//http.createServer(app).listen(3000);
server.listen(3000);

//event emitter, when new data is received from existing connection
io.on("connection", function(socket) {
	"use strict";
	//write to socket (perhaps)
	console.log("client-server connection");
	//when someone posts is should be sent through socket to every other user for each page
	socket.on("newpost", function(obj) {
		console.log("newpost");
		console.log(obj);
		socket.broadcast.emit("newpost", obj);
		console.log("end newpost");
	});


});

app.get("/todos.json", function (req, res) {
	"use strict";
    ToDo.find({}, function (err, toDos) {
	res.json(toDos);
    });
});



app.post("/todos", function (req, res) {
	"use strict";
    console.log(req.body);
    var newToDo = new ToDo({"description":req.body.description, "tags":req.body.tags});
    newToDo.save(function (err, result) {
	if (err !== null) {
	    // the element did not get saved!
	    console.log(err);
	    res.send("ERROR");
	} else {
	    // our client expects *all* of the todo items to be returned, so we'll do
	    // an additional request to maintain compatibility
	    ToDo.find({}, function (err, result) {
		if (err !== null) {
		    // the element did not get saved!
		    res.send("ERROR");
		}
		res.json(result);
	    });
	}
    });
});

