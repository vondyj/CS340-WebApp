// Get object(s) for modification
let updateAuthorForm = document.getElementById("update-author-form");

// Modify objects we need
updateAuthorForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form fields for update
  let chosenAuthor = document.getElementById("select-author");
  let updatedFirstName = document.getElementById("input-firstName");
  let updatedMiddleName = document.getElementById("input-middleName");
  let updatedLastName = document.getElementById("input-lastName");
  console.log(updatedFirstName);

  // Get values
  let chosenAuthorValue = chosenAuthor.value;
  let updatedFirstNameValue = updatedFirstName.value;
  let updatedMiddleNameValue = updatedMiddleName.value;
  let updatedLastNameValue = updatedLastName.value;

  // Put our data in a JS object
  let data = {
    id: chosenAuthorValue,
    first: updatedFirstNameValue,
    middle: updatedMiddleNameValue,
    last: updatedLastNameValue,
  };
  console.log(data);
  //Setup AJAX
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-author-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add the new data to the table
      window.location.replace("/authors");
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };
  //Send the request and wait
  xhttp.send(JSON.stringify(data));
});
