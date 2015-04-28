var main = function (toDoObjects) {
    "use strict";
    var socket = io.connect("http://localhost:3000");
    var toDos;
    var $content,
        i;
    console.log("SANITY CHECK");
    
    socket.on("newpost", function(obj) {
        console.log("dynamic update should be here");
        //console.log(obj);
        console.log("end dynamic update");

        toDoObjects = obj;
        toDos = toDoObjects.map(function (toDo) {
                  // we'll just return the description
                  // of this toDoObject
                  return toDo.description;
            });

        console.log(toDoObjects);
        console.log(toDos);

        console.log("This should empty content");

        $("main .content").empty();
        
        if ($(".tabs .active").text() === "Newest") {
            console.log("This is newest");
            $content = $("<ul>");
            for (i = toDos.length-1; i >= 0; i--) {
                $content.append($("<li>").text(toDos[i]));
            }
            console.log($content);
            $("main .content").append($content);

        } else if ($(".tabs .active").text() === "Oldest") {
            console.log("This is oldest");
            $content = $("<ul>");
            toDos.forEach(function (todo) {
                $content.append($("<li>").text(todo));
            });
            $("main .content").append($content);

        } else if ($(".tabs .active").text() === "Tags") {
            var tags = [];

            toDoObjects.forEach(function (toDo) {
                toDo.tags.forEach(function (tag) {
                    if (tags.indexOf(tag) === -1) {
                        tags.push(tag);
                    }
                });
            });
            console.log(tags);

            var tagObjects = tags.map(function (tag) {
                var toDosWithTag = [];

                toDoObjects.forEach(function (toDo) {
                    if (toDo.tags.indexOf(tag) !== -1) {
                        toDosWithTag.push(toDo.description);
                    }
                });

                return { "name": tag, "toDos": toDosWithTag };
            });

            console.log(tagObjects);

            tagObjects.forEach(function (tag) {
                var $tagName = $("<h3>").text(tag.name),
                    $content = $("<ul>");


                tag.toDos.forEach(function (description) {
                    var $li = $("<li>").text(description);
                    $content.append($li);
                });

                $("main .content").append($tagName);
                $("main .content").append($content);
            });
        }   
    });

    //Dont change below here
    toDos = toDoObjects.map(function (toDo) {
          // we'll just return the description
          // of this toDoObject
          return toDo.description;
    });

    $(".tabs a span").toArray().forEach(function (element) {
        var $element = $(element);

        // create a click handler for this element
        $element.on("click", function () {
            var $input,
                $button;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul>");
                for (i = toDos.length-1; i >= 0; i--) {
                    $content.append($("<li>").text(toDos[i]));
                }

            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul>");
                toDos.forEach(function (todo) {
                    $content.append($("<li>").text(todo));
                });

            } else if ($element.parent().is(":nth-child(3)")) {
                var tags = [];

                toDoObjects.forEach(function (toDo) {
                    toDo.tags.forEach(function (tag) {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    });
                });
                console.log(tags);

                var tagObjects = tags.map(function (tag) {
                    var toDosWithTag = [];

                    toDoObjects.forEach(function (toDo) {
                        if (toDo.tags.indexOf(tag) !== -1) {
                            toDosWithTag.push(toDo.description);
                        }
                    });

                    return { "name": tag, "toDos": toDosWithTag };
                });

                console.log(tagObjects);

                tagObjects.forEach(function (tag) {
                    var $tagName = $("<h3>").text(tag.name),
                        $content = $("<ul>");


                    tag.toDos.forEach(function (description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });

            } else if ($element.parent().is(":nth-child(4)")) {
                var $input = $("<input>").addClass("description"),
                    $inputLabel = $("<p>").text("Description: "),
                    $tagInput = $("<input>").addClass("tags"),
                    $tagLabel = $("<p>").text("Tags: "),
                    $button = $("<span>").text("+");

                $button.on("click", function () {
                    var description = $input.val(),
                        tags = $tagInput.val().split(","),
                        newToDo = {"description":description, "tags":tags};

                    //socket.emit("newpost", newToDo);

                    $.post("todos", newToDo, function (result) {
                        console.log(result);

                        socket.emit("newpost", result);
                        //toDoObjects.push(newToDo);
                        toDoObjects = result;

                        // update toDos
                        toDos = toDoObjects.map(function (toDo) {
                            return toDo.description;
                        });

                        $input.val("");
                        $tagInput.val("");
                    });
                });

                $content = $("<div>").append($inputLabel)
                                     .append($input)
                                     .append($tagLabel)
                                     .append($tagInput)
                                     .append($button);
            }

            $("main .content").append($content);

            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");
};

$(document).ready(function () {
    $.getJSON("todos.json", function (toDoObjects) {
        main(toDoObjects);
    });
});