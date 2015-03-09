
//used code from http://stackoverflow.com/questions/5943630/basic-example-of-using-ajax-with-jsonp
var processSearch = function() {
    var movie = $(".movie-input input").val();
    console.log("inside processSearch");
    console.log(movie);
    getAPIdata(movie);
};

var getAPIdata = function(search){
    $.ajax({
        url: 'http://api.themoviedb.org/3/search/movie?api_key=716663ae9b4d8eb9f7e4a9c30ee7ee2f&query=' + search,
        dataType: 'jsonp',
        success: function(data){
            outPutData(data);
        }
    });
};

var outPutData = function(data) {
    var text = '';

    data.results.forEach(function (item) {
        text += "<li>" + item.original_title + "</li>";
    });
    
    $("main .movielist").append(text);
};

var main = function() {
    "use strict";

    $(".movie-input button").click(processSearch);
};

$(document).ready(main);