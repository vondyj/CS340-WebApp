/*
    SETUP
*/

// Express
const express = require("express"); //using the express library for the web server
const app = express(); // instantiate an express object to interact with the server in code

// app.js - SETUP section
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

PORT = 2369;

// app.js
const { engine } = require("express-handlebars");
const exphbs = require("express-handlebars"); // Import express-handlebars
const helpers = require("handlebars-helpers")(); // Import handlebars-helpers

app.engine(".hbs", engine({ extname: ".hbs" })); // Create an instance of the handlebars engine to process templates
app.set("view engine", ".hbs"); // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
const db = require("./database/db-connector");

/*
    ROUTES
*/

// homepage -------------------------------------------------------------------------------------------------------

app.get("/", function (req, res) {
  res.render("index");
});



// authors -------------------------------------------------------------------------------------------------------

app.get("/authors", function (req, res) {
  
  let queryTable;
  let queryDropDown = `SELECT authors.authorId AS id, CONCAT(authors.lastName, ', ', authors.firstName, IFNULL(CONCAT(' ', authors.middleName), "")) AS author, authors.firstName AS first, authors.middleName AS middle, authors.lastName AS last FROM authors ORDER BY authors.lastName;`;

  // no query string, perform a basic SELECT
  if (req.query.lastName === undefined) {
    queryTable = "SELECT authors.authorId AS id, authors.lastName AS last, authors.firstName AS first, IFNULL(authors.middleName, '') AS middle FROM authors ORDER BY authors.lastName;";
  }

  // there is a query string, assume this is a search and return desired results
  else {
    queryTable = `SELECT authors.authorId AS id, authors.lastName AS last, authors.firstName AS first, IFNULL(authors.middleName, '') AS middle FROM authors WHERE authors.lastName LIKE "${req.query.lastName}%" ORDER BY authors.lastName;`; 
  }

  db.pool.query(queryTable, function (error, rows, fields) {
    let authorsTable = rows;

    db.pool.query(queryDropDown, (error, rows, fields) => {
      let authorsDropDown = rows;

      return res.render("authors", { data: authorsTable, dropDown: authorsDropDown });
    
    });

  });

});

app.post("/add-author-form", function (req, res) {

  let data = req.body;

  let queryInsert;

  // handle null values
  let middle = String(data["input-middleName"]);

  if (middle === '')
  {
    middle = 'NULL'
    queryInsert = `INSERT INTO authors (firstName, middleName, lastName) VALUES ('${data["input-firstName"]}', ${middle}, '${data["input-lastName"]}')`;
  }
  else {
    queryInsert = `INSERT INTO authors (firstName, middleName, lastName) VALUES ('${data["input-firstName"]}', '${middle}', '${data["input-lastName"]}')`;
  }
  
  db.pool.query(queryInsert, function (error, rows, fields) {
    
    if (error) {
      console.log(error);
      res.sendStatus(400);
    }

    else {
      res.redirect("/authors");
    }

  });

});

app.delete("/delete-author-ajax/", function (req, res, next) {

  let data = req.body;

  let authorId = parseInt(data.id);
  let queryDeleteAuthor = `DELETE FROM authors WHERE authors.authorId = ?`;

  db.pool.query(queryDeleteAuthor, [authorId], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.redirect("/authors");
    }
  });
});

app.put("/put-author-ajax", function (req, res, next) {
  let data = req.body;

  let lastName = data.last;
  let firstName = data.first;
  let middleName = data.middle;
  let id = data.id;

  let queryUpdateAuthor;

  if (middleName === '')
  {
    middleName = 'NULL'
    queryUpdateAuthor = `UPDATE authors SET authors.lastName = '${lastName}', authors.firstName = '${firstName}', authors.middleName = ${middleName} WHERE authors.authorId = '${id}';`;
  }

  else {
    queryUpdateAuthor = `UPDATE authors SET authors.lastName = '${lastName}', authors.firstName = '${firstName}', authors.middleName = '${middleName}' WHERE authors.authorId = '${id}';`;
  }

  db.pool.query(queryUpdateAuthor, function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    }
    else {
    res.redirect("/authors");
    }

  });
});



// books -------------------------------------------------------------------------------------------------------

app.get("/books", function (req, res) {

  let queryTable;
  let queryDropDown = "SELECT books.bookId AS id, books.title, books.stockQuantity AS quantity, books.unitPrice AS price FROM books ORDER BY books.title"

  // no query string, perform a basic SELECT
  if (req.query.title === undefined) {
    queryTable = "SELECT books.bookId AS id, books.title, CONCAT(authors.lastName, ', ',authors.firstName, ' ', IFNULL(authors.middleName, '')) AS author, stockQuantity AS quantity, CONCAT('$', (unitPrice)) AS price FROM books LEFT JOIN authorsBooks ON books.bookId = authorsBooks.FK_books_bookId LEFT JOIN authors ON authorsBooks.FK_authors_authorId = authors.authorId ORDER BY books.title;"; // Define our query
  } else {
    queryTable = `SELECT books.bookId AS id, books.title, CONCAT(authors.lastName, ', ',authors.firstName, ' ', IFNULL(authors.middleName, '')) AS author, stockQuantity AS quantity, CONCAT('$', (unitPrice)) AS price FROM books LEFT JOIN authorsBooks ON books.bookId = authorsBooks.FK_books_bookId LEFT JOIN authors ON authorsBooks.FK_authors_authorId = authors.authorId WHERE books.title LIKE "${req.query.title}%" ORDER BY books.title;`;
  }

  db.pool.query(queryTable, function (error, rows, fields) {
    let booksTable = rows;

    db.pool.query(queryDropDown, (error, rows, fields) => {
      let authorsDropDown = rows;

      return res.render("books", { data: booksTable, dropDown: authorsDropDown });
    });
  });
});

app.post("/add-book-form", function (req, res) {

  let data = req.body;

  // handle titles with ' inside them
  let title = `${data["input-title"]}`;


  let queryInsert = `INSERT INTO books (title, stockQuantity, unitPrice) VALUES ("${title}", '${data["input-quantity"]}', '${data["input-price"]}')`;
  
  db.pool.query(queryInsert, function (error, rows, fields) {

    if (error) {

      console.log(error);
      res.sendStatus(400);
    }

    else {
      res.redirect("/books");
    }
  });
});

app.delete("/delete-book-ajax/", function (req, res, next) {
  let data = req.body;
  let bookId = parseInt(data.id);
  let queryDelete = `DELETE FROM books WHERE books.bookId = ?`;

  db.pool.query(queryDelete, [bookId], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    }
  });
});

app.put("/put-book-ajax", function (req, res, next) {
  let data = req.body;

  let title = data.title;
  let quantity = data.quantity;
  let price = data.price;
  let id = data.id;

  let queryUpdate = `UPDATE books SET books.title = '${title}', books.stockQuantity = '${quantity}', books.unitPrice = '${price}' WHERE books.bookId = '${id}';`;

  db.pool.query(queryUpdate, function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    }
    else {
      res.redirect("/authors");
    }

  });
});



// customers -------------------------------------------------------------------------------------------------------

app.get("/customers", function (req, res) {
  
  let queryTable;
  let queryDropDown = "SELECT customers.customerId AS id, CONCAT(customers.lastName, ', ', customers.firstName) AS customer, customers.firstName AS first, customers.lastName AS last, customers.email FROM customers ORDER BY customers.lastName;";

  // no query string, perform a basic SELECT
  if (req.query.lastName === undefined) {
    queryTable = "SELECT customers.customerId AS id, customers.lastName AS last, customers.firstName AS first, customers.email AS email FROM customers ORDER BY customers.lastName ASC;";
  }

  // there is a query string, assume this is a search and return desired results
  else {
    queryTable = `SELECT customers.customerId AS id, customers.lastName AS last, customers.firstName AS first, customers.email AS email FROM customers WHERE customers.lastName LIKE "${req.query.lastName}%" ORDER BY customers.lastName ASC;`;
  }
  
  db.pool.query(queryTable, function (error, rows, fields) {

    let customersTable = rows;

    db.pool.query(queryDropDown, function (error, rows, fields) {

        let customersDropDown = rows;

        res.render("customers", { data: customersTable, dropDown: customersDropDown});
    });
  });
});

app.post("/add-customer-form", function (req, res) {

  let data = req.body;

  queryInsert = `INSERT INTO customers (firstName, lastName, email) VALUES ('${data["input-firstName"]}', '${data["input-lastName"]}', '${data["input-email"]}')`;
  
  db.pool.query(queryInsert, function (error, rows, fields) {

    if (error) {
     
      console.log(error);
      res.sendStatus(400);
    }
    else {
      res.redirect("/customers");
    }
  });
});

app.delete("/delete-customer-ajax/", function (req, res, next) {
  
  let data = req.body;
  let customerId = parseInt(data.id);
  let queryDelete = `DELETE FROM customers WHERE customers.customerId = ?`;

  db.pool.query(queryDelete, [customerId], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.redirect("/customers");
    }
  });
});

app.put("/put-customer-ajax", function (req, res, next) {
  let data = req.body;

  let lastName = data.last;
  let firstName = data.first;
  let email = data.email;
  let id = data.id;

  let queryUpdateCustomer = `UPDATE customers SET customers.lastName = '${lastName}', customers.firstName = '${firstName}', customers.email = '${email}' WHERE customers.customerId = '${id}';`;

  // Run the 1st query
  db.pool.query(queryUpdateCustomer, function (error, rows, fields) {
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    }

  });
});



// purchases -------------------------------------------------------------------------------------------------------

app.get("/purchases", function (req, res) {
  
  let queryTable;
  let queryCustomersDropDown = "SELECT customers.customerId AS id, CONCAT(customers.lastName, ', ', customers.firstName) AS customer FROM customers ORDER BY customers.lastName;";
  let queryStaffDropDown = "SELECT staff.staffId AS id, CONCAT(staff.lastName, ', ', staff.firstName) AS staff FROM staff ORDER BY staff.lastName;";
  let queryPurchaseDropDown = "SELECT purchases.purchaseId AS id, CONCAT(customers.lastName,', ', customers.firstName) AS customerName, customers.customerId, staff.staffId, purchases.purchaseDate AS date FROM purchases LEFT JOIN customers ON purchases.FK_customers_customerId = customers.customerId LEFT JOIN staff ON purchases.FK_staff_staffId = staff.staffId ORDER BY purchases.purchaseDate;";
  
  // no query string, perform a basic SELECT
  if (req.query.date === '') {
    queryTable = "SELECT purchases.purchaseId AS id, purchases.purchaseDate AS date, CONCAT(customers.lastName,', ', customers.firstName) AS customer, CONCAT(staff.lastName,', ', staff.firstName) AS staff, SUM(purchaseBookDetails.quantity) AS number_sold, CONCAT('$', SUM(books.unitPrice * purchaseBookDetails.quantity)) AS order_total FROM purchases LEFT JOIN staff ON purchases.FK_staff_staffId = staff.staffId JOIN customers ON purchases.FK_customers_customerId = customers.customerId LEFT JOIN purchaseBookDetails ON purchases.purchaseId = purchaseBookDetails.FK_purchases_purchaseId LEFT JOIN books ON purchaseBookDetails.FK_books_bookId = books.bookId GROUP BY purchases.purchaseId ORDER BY purchases.purchaseDate ASC;";
  }

  // there is a query string, assume this is a search and return desired results
  else {
    queryTable = `SELECT purchaseBookDetails.detailId AS id, purchaseBookDetails.FK_purchases_purchaseId AS purchase_id, purchases.purchaseDate AS date, CONCAT(customers.lastName, ', ', customers.firstName) AS customer, CONCAT(staff.lastName, ', ', staff.firstName) AS staff, purchaseBookDetails.quantity, purchaseBookDetails.FK_books_bookId AS book_id, books.title, CONCAT('$', books.unitPrice * purchaseBookDetails.quantity) AS line_total FROM purchaseBookDetails 
    LEFT JOIN books ON purchaseBookDetails.FK_books_bookId = books.bookId LEFT JOIN purchases ON purchaseBookDetails.FK_purchases_purchaseId = purchases.purchaseId LEFT JOIN customers ON purchases.FK_customers_customerId = customers.customerId LEFT JOIN staff ON purchases.FK_staff_staffId = staff.staffId WHERE purchases.purchaseDate = "${req.query.date}%" ORDER BY purchases.purchaseDate ASC;`;
  }


  db.pool.query(queryTable, function (error, rows, fields) {
    // Execute the query
    let purchasesTable = rows;

    db.pool.query(queryCustomersDropDown, (error, rows, fields) => {
      let customersDropDown = rows;

      db.pool.query(queryStaffDropDown, (error, rows, fields) => {
        let staffDropDown = rows;

        db.pool.query(queryPurchaseDropDown, (error, rows, fields) => {
          
          let purchaseDropDown = rows

          return res.render("purchases", {
            data: purchasesTable,
            dropDownCustomers: customersDropDown,
            dropDownStaff: staffDropDown,
            dropDownPurchases: purchaseDropDown
          });
        });
      });
    });
  });
});

app.post("/add-purchase-form", function (req, res) {

  let data = req.body;
  let query1;

  let staff = `${data["select-staff"]}`;

  if (String(staff) == "") {
    staff = "NULL";
    query1 = `INSERT INTO purchases (purchaseDate, FK_staff_staffId, FK_customers_customerId) VALUES ('${data["input-purchaseDate"]}', ${staff}, '${data["select-customer"]}')`;
  }
  else{
    query1 = `INSERT INTO purchases (purchaseDate, FK_staff_staffId, FK_customers_customerId) VALUES ('${data["input-purchaseDate"]}', '${staff}', '${data["select-customer"]}')`;
  }

  
  
  db.pool.query(query1, function (error, rows, fields) {

    if (error) {

      console.log(error);
      res.sendStatus(400);
    }

    // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
    // presents it on the screen
    else {
      res.redirect("/purchases");
    }
  });
});

app.delete("/delete-purchase-ajax/", function (req, res, next) {
  
  let data = req.body;

  let purchaseId = parseInt(data.id);
  let queryDelete = `DELETE FROM purchases WHERE purchases.purchaseId = ?`;

  // Run the query
  db.pool.query(queryDelete, [purchaseId], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.redirect("/purchases");
    }
  });
});

app.put("/put-purchase-ajax", function (req, res, next) {
  let data = req.body;

  let queryUpdateStaff;
  let date = data.date;
  let staff = data.staff;
  let customer = data.customer;
  let id = data.id;

  if (String(staff) === '') {
    staff = "NULL"
    queryUpdateStaff = `UPDATE purchases SET purchases.purchaseDate = '${date}', purchases.FK_staff_staffId = ${staff}, purchases.FK_customers_customerId = '${customer}' WHERE purchases.purchaseId = ${id};`;
  }
  else{
    queryUpdateStaff = `UPDATE purchases SET purchases.purchaseDate = '${date}', purchases.FK_staff_staffId = '${staff}', purchases.FK_customers_customerId = '${customer}' WHERE purchases.purchaseId = ${id};`;
  }

  db.pool.query(queryUpdateStaff, function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    }

  });
});



// staff -------------------------------------------------------------------------------------------------------

app.get("/staff", function (req, res) {
  
  let queryTable;
  let queryDropDown = "SELECT staff.staffId AS id, CONCAT(staff.lastName, ', ', staff.firstName) AS staff, staff.firstName AS first, staff.lastName AS last, staff.email FROM staff ORDER BY staff.lastName;";

  // no query string, perform a basic SELECT
  if (req.query.lastName === undefined) {
    queryTable = "SELECT staff.staffId AS id, staff.lastName AS last, staff.firstName AS first, staff.email AS email FROM staff ORDER BY staff.lastName ASC;";
  }

  // there is a query string, assume this is a search return desired results
  else {
    queryTable = `SELECT staff.staffId AS id, staff.lastName AS last, staff.firstName AS first, staff.email AS email FROM staff WHERE staff.lastName LIKE "${req.query.lastName}%" ORDER BY staff.lastName ASC;`;
  }


  db.pool.query(queryTable, function (error, rows, fields) {
    let staffTable = rows;

    db.pool.query(queryDropDown, function (error, rows, fields) {
      let staffDropDown = rows;

      res.render("staff", { data: staffTable, dropDown: staffDropDown });

    });
  });
});

app.post("/add-staff-form", function (req, res) {
 
  let data = req.body;

  queryTable = `INSERT INTO staff (firstName, lastName, email) VALUES ('${data["input-firstName"]}', '${data["input-lastName"]}', '${data["input-email"]}')`;
  db.pool.query(queryTable, function (error, rows, fields) {

    if (error) {
      console.log(error);
      res.sendStatus(400);
    }
    else {
      res.redirect("/staff");
    }
  });
});

app.delete("/delete-staff-ajax/", function (req, res, next) {
  let data = req.body;
  let staffId = parseInt(data.id);
  let queryDelete = `DELETE FROM staff WHERE staff.staffId = ?`;

  // Run the query
  db.pool.query(queryDelete, [staffId], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.redirect("/staff");
    }
  });
});

app.put("/put-staff-ajax", function (req, res, next) {
  let data = req.body;

  let lastName = data.last;
  let firstName = data.first;
  let email = data.email;
  let id = data.id;

  let queryUpdateStaff = `UPDATE staff SET staff.lastName = '${lastName}', staff.firstName = '${firstName}', staff.email = '${email}' WHERE staff.staffId = ${id};`;

  // Run the 1st query
  db.pool.query(queryUpdateStaff, function (error, rows, fields) {
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    }

  });
});



// authorsBooks -------------------------------------------------------------------------------------------------------

app.get("/authorsBooks", function (req, res) {
  
  let queryTable = "SELECT authorBookId AS id, FK_authors_authorId AS author_id, CONCAT(authors.lastName, ', ', authors.firstName, ' ', IFNULL(authors.middleName, '')) AS author, FK_books_bookId AS book_id, books.title FROM authorsBooks JOIN authors ON authorsBooks.FK_authors_authorId = authors.authorId JOIN books ON authorsBooks.FK_books_bookId = books.bookId ORDER BY authors.lastName, books.title;";
  let queryDropDownAuthors = "SELECT authors.authorId AS id, CONCAT(authors.lastName, ', ', authors.firstName, ' ', IFNULL(authors.middleName, '')) AS author FROM authors ORDER BY authors.lastName;";
  let queryDropDownBooks = "SELECT books.bookId AS id, books.title FROM books ORDER BY books.title;";

  db.pool.query(queryTable, function (error, rows, fields) {
    let authorsBooksTable = rows;

    db.pool.query(queryDropDownAuthors, (error, rows, fields) => {
      let authorsDropDown = rows;

      db.pool.query(queryDropDownBooks, (error, rows, fields) => {
        let booksDropDown = rows;

        return res.render("authorsBooks", {data: authorsBooksTable, dropDown1: authorsDropDown, dropDown2: booksDropDown,});

      });
    });
  });
});

app.post("/add-authorBook-form", function (req, res) {

  let data = req.body;

  queryInsert = `INSERT INTO authorsBooks (FK_books_bookId, FK_authors_authorId) VALUES ('${data["select-book"]}', '${data["select-author"]}')`;
  db.pool.query(queryInsert, function (error, rows, fields) {

    if (error) {
      console.log(error);
      res.sendStatus(400);
    }
    else {
      res.redirect("/authorsBooks");
    }
  });
});

app.delete("/delete-author-book-ajax/", function (req, res, next) {
  let data = req.body;
  let authorBookId = parseInt(data.id);
  let queryDelete = `DELETE FROM authorsBooks WHERE authorsBooks.authorBookId = ?`;

  db.pool.query(queryDelete, [authorBookId], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.redirect("/authorsBooks");
    }
  });
});



// purchaseBookDetails -------------------------------------------------------------------------------------------------------

app.get("/purchaseBookDetails", function (req, res) {
  let queryTable = "SELECT purchaseBookDetails.detailId AS id, purchaseBookDetails.FK_purchases_purchaseId AS purchase_id, purchases.purchaseDate AS date, CONCAT(customers.lastName, ', ', customers.firstName) AS customer, CONCAT(staff.lastName, ', ', staff.firstName) AS staff, purchaseBookDetails.quantity, purchaseBookDetails.FK_books_bookId AS book_id, books.title, CONCAT('$', books.unitPrice * purchaseBookDetails.quantity) AS line_total FROM purchaseBookDetails LEFT JOIN books ON purchaseBookDetails.FK_books_bookId = books.bookId LEFT JOIN purchases ON purchaseBookDetails.FK_purchases_purchaseId = purchases.purchaseId LEFT JOIN customers ON purchases.FK_customers_customerId = customers.customerId LEFT JOIN staff ON purchases.FK_staff_staffId = staff.staffId ORDER BY purchases.purchaseDate;";
  let queryDropDownPurchases = "SELECT purchases.purchaseId AS id, purchases.purchaseDate AS date, CONCAT(customers.lastName, ', ', customers.firstName) AS customer FROM purchases JOIN customers ON purchases.FK_customers_customerId = customers.customerId ORDER BY purchases.purchaseDate;";
  let queryDropDownBooks = "SELECT books.bookId AS id, books.stockQuantity AS quantity, books.title FROM books ORDER BY books.title;";

  db.pool.query(queryTable, function (error, rows, fields) {
    let purchaseDetails = rows;

    db.pool.query(queryDropDownPurchases, (error, rows, fields) => {
      let purchaseDropDown = rows;

      db.pool.query(queryDropDownBooks, (error, rows, fields) => {
        let booksDropDown = rows;

        return res.render("purchaseBookDetails", {data: purchaseDetails, dropDownPurchases: purchaseDropDown, dropDownBooks: booksDropDown,});
      
      });
    });
  });
});

app.post("/add-details-form", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Create the query and run it on the database
  query1 = `INSERT INTO purchaseBookDetails (quantity, FK_books_bookId, FK_purchases_purchaseId) VALUES ('${data["input-quantity"]}', '${data["select-book"]}', '${data["select-purchase"]}')`;
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    }

    // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
    // presents it on the screen
    else {
      res.redirect("/purchaseBookDetails");
    }
  });
});

app.delete("/delete-purchase-book-detail-ajax/", function (req, res, next) {
  let data = req.body;
  let purchaseBookDetailId = parseInt(data.id);
  let delete_author_book = `DELETE FROM purchaseBookDetails WHERE purchaseBookDetails.detailId = ?`;

  // Run the query
  db.pool.query(delete_author_book, [purchaseBookDetailId], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.redirect("/purchaseBookDetails");
    }
  });
});



/*
    LISTENER
*/

app.listen(PORT, function () {
  console.log(
    "Express started on http://localhost:" +
      PORT +
      "; press Ctrl-C to terminate."
  );
});
