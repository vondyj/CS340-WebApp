function updateFormValues() {

    let title = document.getElementById("input-newTitle");
    let quantity = document.getElementById("input-newQuantity");
    let price = document.getElementById("input-newPrice")
  
    let select = document.getElementById("select-book")
    let selectValue = select.value
    let fillValues = selectValue.split(",")
  
    title.value = fillValues[1]
    quantity.value =  fillValues[2]
    price.value = fillValues[3]
  
  }

// Get object(s) for modification
let updateBookForm = document.getElementById("update-book-form");

// Modify objects we need
updateBookForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form fields for update
  let chosenBook = document.getElementById("select-book");
  let updatedTitle = document.getElementById("input-newTitle");
  let updatedQuantity = document.getElementById("input-newQuantity");
  let updatedPrice = document.getElementById("input-newPrice");

  let book = chosenBook.value
  let bookValuesArray = book.split(",")

  // Get values
  let chosenBookValue = bookValuesArray[0];
  let updatedTitleValue = updatedTitle.value;
  let updatedQuantityValue = updatedQuantity.value;
  let updatedPriceValue = updatedPrice.value;

  // Put our data in a JS object
  let data = {
    id: chosenBookValue,
    title: updatedTitleValue,
    quantity: updatedQuantityValue,
    price: updatedPriceValue,
  };

  console.log(data)

  //Setup AJAX
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-book-ajax", true);
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