// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */ 

var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var urlSchema = mongoose.Schema({
  "longURL" : String,
  "shortURL" : String,
  "hits" : Number, default: 0
  
});

var url = mongoose.model("url", urlSchema);

var http = require("http");

var routes = require("./routes/index");
var users = require("./routes/users");

var app = express();

http.createServer(app).listen(3000);

mongoose.connect("mongodb://localhost/test");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/users", users);

var topTen = function(callback) {
	  "use strict";
  //(No search params, return top 10 sorted by hit field)

  url.find({}, null, {limit : 10, sort : {hits : -1}}, function(err, reply) {
    if (err !== null) {
      console.log("ERROR: " + err);
      return;
    }
    console.log("Inside top 10 function");
	console.log(reply);
    callback(reply);
  });
};

app.post("/link", function (req, res) {
  "use strict";
  var temp = req.body.link;
  console.log("You entered " + temp);
  var linkShort;
  var response = {"longL": null, "shortL": null, "topTen": []};
  var newURL;
  response.longL = "hello";
  //see if the sent over url is in the 
  //if the sent over url is a short url see if it is in the shortURL column
  if (temp.substring(0,14) === "localhost:3000") {
    url.findOne({"shortURL" : temp}, function(err, reply) {
      if (err !== null) {
        console.log("ERROR: " + err);
        return;
      }

      if (reply) {

      	reply.hits += 1;
      	reply.save(function (err) {
      		if (err) {
      			console.log("Did not update count:" + err);
      		}
      	});


        response.longL = reply.longURL;
        response.shortL = reply.shortURL;
        topTen(function(value) {
        	value.forEach(function (object) {
        		response.topTen.push(object);
        	});
        	res.json(response);
        	console.log("Short url found");
  			console.log(response);
        });
        console.log("outside of callback, after");
  		console.log(response); 
        console.log("Short url found");

  		console.log(response);
      }
      else {
        console.log("short url is not in our database");
      }
    });
  } else {
    //check if the sent over url is in the large url column
    url.findOne({"longURL" : temp}, function(err, reply) {
      if (err !== null) {
        console.log("ERROR: " + err);
        return;
      }

      if (reply) {
      	reply.hits += 1;
      	reply.save(function (err) {
      		if (err) {
      			console.log("Did not update count:" + err);
      		}
      	});

      	console.log(response.topTen);
        response.longL = reply.longURL;
        response.shortL = reply.shortURL;

        topTen(function(value) {
        	value.forEach(function (object) {
        		response.topTen.push(object);
        	});
        	res.json(response);
        	console.log("Large url found");
  			console.log(response);
        });
        console.log("outside of callback, after");
  		console.log(response); 
      }
      else {
        //short or long not found so put into database with short url
        console.log("large url not found");
        linkShort = "localhost:3000/"  + Date.now().toString(36).replace(/[^a-z]+/g, "").substr(0, 5);
        newURL = new url({"longURL" : temp, "shortURL" : linkShort, "hits" : 1});
        newURL.save(function (err) {
        	if (err !== null) {
        		console.log(err);
        		console.log("onject was not saved");
        	} else {
        		console.log("the object was saved");
        	}
        });

        response.longL = temp;
        response.shortL = linkShort;
        topTen(function(value) {
        	value.forEach(function (object) {
        		response.topTen.push(object);
        	});
        	res.json(response);
        	console.log("Object saved");
  			console.log(response);
        });
        console.log("outside of callback, after");
  		console.log(response); 
      }
    });
  }
});

module.exports = app;