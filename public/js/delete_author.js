function deleteAuthor(authorId) {
    // Put our data we want to send in a javascript object
    let data = {
        id: authorId
    };

    // Setup our AJAX request
    const xhttp = new XMLHttpRequest();

    xhttp.open("DELETE", "/delete-author-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

    window.location.reload();

}



      
      
