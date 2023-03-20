/*
  Overall structure - adapted
    Oregon State University, CS340: Introduction to Databases - 'nodejs-starter-app'
    George Kochera, Cortona1, Michael Curry, dmgs11 (2/28/23 - 3/19/23 )
    https://github.com/osu-cs340-ecampus/nodejs-starter-app
  
*/

function updateFormValues() {

  let firstName = document.getElementById("input-newFirstName");
  let lastName = document.getElementById("input-newLastName");
  let email = document.getElementById("input-newEmail")

  let select = document.getElementById("select-staff")
  let selectValue = select.value
  let fillValues = selectValue.split(",")

  firstName.value = fillValues[1]
  lastName.value =  fillValues[2]
  email.value = fillValues[3]

}

// Get object(s) for modification
let updateStaffForm = document.getElementById("update-staff-form");

// Modify objects we need
updateStaffForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form fields for update
  let chosenStaff = document.getElementById("select-staff");
  let updatedFirstName = document.getElementById("input-newFirstName");
  let updatedLastName = document.getElementById("input-newLastName");
  let updatedEmail = document.getElementById("input-newEmail");

  let staff = chosenStaff.value
  let staffValuesArray = staff.split(",")

  // Get values
  let chosenStaffValue = staffValuesArray[0];
  let updatedFirstNameValue = updatedFirstName.value;
  let updatedLastNameValue = updatedLastName.value;
  let updatedEmailValue = updatedEmail.value;

  // Put our data in a JS object
  let data = {
    id: chosenStaffValue,
    first: updatedFirstNameValue,
    last: updatedLastNameValue,
    email: updatedEmailValue,
  };

  //Setup AJAX
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-staff-ajax", true);
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