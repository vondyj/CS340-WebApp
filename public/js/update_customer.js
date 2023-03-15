// Get object(s) for modification
let updateCustomerForm = document.getElementById("update-customer-form");

// Modify objects we need
updateCustomerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form fields for update
  let chosenCustomer = document.getElementById("select-customer");
  let updatedFirstName = document.getElementById("input-newFirstName");
  let updatedLastName = document.getElementById("input-newLastName");
  let updatedEmail = document.getElementById("input-newEmail");

  // Get values
  let chosenCustomerValue = chosenCustomer.value;
  let updatedFirstNameValue = updatedFirstName.value;
  let updatedLastNameValue = updatedLastName.value;
  let updatedEmailValue = updatedEmail.value;

  // Put our data in a JS object
  let data = {
    id: chosenCustomerValue,
    first: updatedFirstNameValue,
    last: updatedLastNameValue,
    email: updatedEmailValue,
  };

  //Setup AJAX
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-customer-ajax", true);
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