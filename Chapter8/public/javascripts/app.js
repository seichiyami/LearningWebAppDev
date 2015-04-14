// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

var main = function (){
	"use strict";
	$("#button").on("click", function(){
		$(".result").empty();
		var temp = {"link": ""};
		temp.link = $("#linkParse").val();
		console.log(temp);
		$.post("link", temp, function (response) {
			$(".result").append($("<p>").append("Original Long Url: " + response.longL));
			$(".result").append($("<p>").append("Short Url: " + response.shortL));

			response.topTen.forEach(function (object) {
				$(".topListHere").append($("<p>").append(object.longURL).append(" Visits: ").append(object.hits));
				console.log("Objects: " + JSON.stringify(object));

			});
		});
	});

	/*
	setInterval(function(){ 
		$('.topListHere').empty();
		/// show login users 
		$.ajax({
			url:"/getTopList",
			error : function () {

			},dataType: "json",
			success: function (reply) {
				var data = JSON.parse(reply);
				var i;
				for (i = 0; i < 10; i++) {
					$('.topListHere').append($('<p>').append(data[i]));
				}
				console.log(data[0][1]);
			},type: "post"
		});}, 3000);
	*/
};

$(document).ready(main);