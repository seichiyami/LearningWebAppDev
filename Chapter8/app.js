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

/*
//get url id and will proccess
app.get("/:id", function (req, res) {
  "use strict";
  console.log(req.params.id);
  var shortLink = "localhost:3000/" + req.params.id;
  console.log(shortLink);
  console.log(shortLink);

  url.findOne({"shortURL" : shortLink}, function (err, reply) {
    if (err !== null) {
      console.log("ERROR: " + err);
      return;
    }

    if (reply) {
      console.log("http://" + reply.url);
      res.redirect("http://" + reply.url);
      url.update({"shortURL" : shortLink}, {$inc : {hits : 1}});
      console.log("Am I ever here");
    }
    else {
      res.send("Error: Unable to find site's URL to redirect to.");
    }

    console.log(reply.url);
    console.log(reply.shortURL);
  });
});
*/
//https://ricochen.wordpress.com/2012/02/28/example-sorted-set-functions-with-node-js-redis/
//used code to convert to javascript object to respond
app.post("/getTopList", function (req, res) {
  "use strict";
  //(No search params, return top 10 sorted by hit field)
  /*
  url.find({}, {limit : 10, sort : {hits : 1}}, function(err, reply) {

    if (err !== null) {
      console.log("ERROR: " + err);
      return;
    }

    res.json(JSON.stringify(reply));
    console.log(reply);
  });
*/
  /*
  client.zrevrange('counter', 0, -1, function (err, reply) {
    var lists =_.groupBy(reply, function(a,b) {
      return b;
      // return Math.floor(b/2);
    });
    res.json(JSON.stringify(lists));
    console.log(lists);
    //console.log(_.toArray(lists));
  }); 
  */
});

var topTen = function() {
	  "use strict";
  //(No search params, return top 10 sorted by hit field)

  url.find({}, null, {limit : 10, sort : {hits : 1}}, function(err, reply) {
    if (err !== null) {
      console.log("ERROR: " + err);
      return;
    }
    console.log("Inside top 10 function");
	console.log(reply);
    return reply;
  });
};

app.post("/link", function (req, res) {
  "use strict";
  var temp = req.body.link;
  console.log("You entered " + temp);
  var linkShort;
  var response = {"longL": null, "shortL": null, "topTen": null};
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
        response.topTen = topTen();
        console.log("Short url found");

        res.json(response);
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
      	//url.update({"longURL" : reply.longURL}, {$inc: {"hits" : 2}});

      	reply.hits += 1;
      	reply.save(function (err) {
      		if (err) {
      			console.log("Did not update count:" + err);
      		}
      	});

        response.longL = reply.longURL;
        response.shortL = reply.shortURL;
        response.topTen = topTen();
        console.log("Large url found");

        res.json(response);
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
        response.topTen = topTen();

        res.json(response);
  		console.log(response); 
      }
    });
  }
  

  

});

module.exports = app;