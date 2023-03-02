$("a").click(function(){
    var col = $(this).closest("tr");
    $("input[name='input-lastName']").val(col.find("td:eq(1)").text());
    $("input[name='input-firstName']").val(col.find("td:eq(2)").text());
    $("input[name='input-middleName']").val(col.find("td:eq(3)").text());
});

function updateAuthor(author)
    // Put our data we want to send in a javascript object
    let data = {
        last: author.last,
        first: author.first,
        middle: author.middle,
        id: author.id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-author", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
