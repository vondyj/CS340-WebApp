function updateFormValues() {

    let staff = document.getElementById("select-newStaff");
    let customer = document.getElementById("select-newCustomer");
    let date = document.getElementById("input-newDate");
  
    let select = document.getElementById("select-purchase");
    let selectValue = select.value;
    let fillValues = selectValue.split(",");
  
    customer.value = fillValues[1];
    staff.value = fillValues[2];
    date.value = fillValues[3];
  
  }

  // Get object(s) for modification
let updatePurchaseForm = document.getElementById("update-purchase-form");

// Modify objects we need
updatePurchaseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form fields for update
  let chosenPurchase = document.getElementById("select-purchase");
  let updatedDate = document.getElementById("input-newDate");
  let updatedStaff = document.getElementById("select-newStaff");
  let updatedCustomer = document.getElementById("select-newCustomer");

  let purchase = chosenPurchase.value
  let purchaseValuesArray = purchase.split(",")

  // Get values
  let chosenPurchaseValue = purchaseValuesArray[0];
  let updatedDateValue = updatedDate.value;
  let updatedStaffValue = updatedStaff.value;
  let updatedCustomerValue = updatedCustomer.value;

  // Put our data in a JS object
  let data = {
    id: chosenPurchaseValue,
    date: updatedDateValue,
    staff: updatedStaffValue,
    customer: updatedCustomerValue,
  };

  console.log(data)

  //Setup AJAX
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-purchase-ajax", true);
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

  // causing issues firefox
  location.reload(true);
});