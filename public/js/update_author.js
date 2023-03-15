function updateFormValues() {

  let firstName = document.getElementById("input-newFirstName");
  let middleName = document.getElementById("input-newMiddleName");
  let lastName = document.getElementById("input-newLastName");

  let select = document.getElementById("select-author")
  let selectValue = select.value
  let myArray = selectValue.split(",")

  firstName.value = myArray[1]
  middleName.value = myArray[2]
  lastName.value =  myArray[3]

}


// Get object(s) for modification
let updateAuthorForm = document.getElementById("update-author-form");

// Modify objects we need
updateAuthorForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form fields for update
  let chosenAuthor = document.getElementById("select-author");
  let updatedFirstName = document.getElementById("input-newFirstName");
  let updatedMiddleName = document.getElementById("input-newMiddleName");
  let updatedLastName = document.getElementById("input-newLastName");

  let author = chosenAuthor.value
  let authorValuesArray = author.split(",")

  // Get values
  let chosenAuthorValue = authorValuesArray[0];
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

  //Setup AJAX
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-author-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add the new data to the table
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };
  //Send the request and wait
  xhttp.send(JSON.stringify(data));
  location.reload(true);
});
