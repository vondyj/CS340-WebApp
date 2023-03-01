// Get the objects we need to modify
let addAuthorForm = document.getElementById('add-author-form-ajax');

// Modify the objects we need
addAuthorForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("input-firstName");
    let inputMiddleName = document.getElementById("input-middleName");
    let inputLastName = document.getElementById("input-lastName");

    // Get the values from the form fields
    let firstNameValue = inputFirstName.value;
    let middleNameValue = inputMiddleName.value;
    let lastNameValue = inputLastName.value;

    // Put our data we want to send in a javascript object
    let data = {
        firstName: firstNameValue,
        middleName: middleNameValue,
        lastName: lastNameValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-author-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputMiddleName.value = '';
            inputLastName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// authors
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("author-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let authorCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.authorId;
    authorCell.innerText = newRow.firstName;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(authorCell);

    
    // Add the row to the table
    currentTable.appendChild(row);
}