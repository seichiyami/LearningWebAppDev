var main = function (){
	"use strict";
	$('#button').on('click', function(){
		$('.result').empty();
		var temp = {"link": ""};
		temp.link = $("#linkParse").val();
		console.log(temp);
		$.post('link', temp, function (response) {
			$(".result").append($("<p>").append("Original Long Url: " + response.longL));
			$(".result").append($("<p>").append("Short Url: " + response.shortL));
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