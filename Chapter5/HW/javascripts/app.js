
/*
used code from http://stackoverflow.com/questions/5943630/basic-example-of-using-ajax-with-jsonp
    and http://stackoverflow.com/questions/9899112/determine-if-a-ul-has-1-or-more-li-within
*/

var outPutData = function(data) {
    "use strict";
    if ($(".movielist").length >= 1)
    {
        $(".movielist").empty();
    }
    var text = "";

    data.results.forEach(function (item) {
        text += "<li>" + item.original_title + "</li>";
    });
    
    $("main .movielist").append(text);
};

var getAPIdata = function(search){
    "use strict";
    $.ajax({
        url: "http://api.themoviedb.org/3/search/movie?api_key=716663ae9b4d8eb9f7e4a9c30ee7ee2f&query=" + search,
        dataType: "jsonp",
        success: function(data){
            outPutData(data);
        }
    });
};

var processSearch = function() {
    "use strict";
    var movie = $(".movie-input input").val();
    console.log("inside processSearch");
    console.log(movie);

    if (movie === "")
    {
        $(".movielist").empty();
        $(".searchResponse").append("<p>Please enter a movie title</p>");
    }
    else
    {
        getAPIdata(movie);    
    }
};

var main = function() {
    "use strict";

    $(".movie-input button").click(processSearch);
};

$(document).ready(main);
/*
var main = function () {
    "use strict";


    var requestURL = "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=270583746863D28DF718B9C989ED2BD7&steamid=76561198041614970&format=json";
    $.getJSON(requestURL, function(item) {
        var text = '';
        console.log(item);
        /*
        item.response.games.forEach(function (item) {
            //text += "<li>" + item.original_title + "</li>";
            console.log(item)
            //$("main .movielist").append(text);

            $img.fadeIn();
        });


    });
};
$(document).ready(main);
*/