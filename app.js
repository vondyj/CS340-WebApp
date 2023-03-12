/*
    SETUP
*/

// Express
const express = require("express"); // We are using the express library for the web server
const app = express(); // We need to instantiate an express object to interact with the server in our code

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
  let query1;
  let query2 = `SELECT authors.authorId AS id, CONCAT(authors.lastName, ', ', authors.firstName, IFNULL(CONCAT(' ', authors.middleName), "")) AS author FROM authors ORDER BY authors.lastName;`;

  // If there is no query string, we just perform a basic SELECT
  if (req.query.lastName === undefined) {
    query1 =
      "SELECT authors.authorId AS id, authors.lastName AS last, authors.firstName AS first, IFNULL(authors.middleName, '') AS middle FROM authors ORDER BY authors.lastName;";
  }

  // If there is a query string, we assume this is a search, and return desired results
  else {
    query1 = `SELECT authors.authorId AS id, authors.lastName AS last, authors.firstName AS first, IFNULL(authors.middleName, '') AS middle FROM authors WHERE authors.lastName LIKE "${req.query.lastName}%" ORDER BY authors.lastName;`;
  }

  db.pool.query(query1, function (error, rows, fields) {
    // Execute the query
    let authors1 = rows;

    db.pool.query(query2, (error, rows, fields) => {
      let authors2 = rows;

      return res.render("authors", { data: authors1, dropDown: authors2 });
    });
  });
});

app.post("/add-author-form", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Create the query and run it on the database
  query1 = `INSERT INTO authors (firstName, middleName, lastName) VALUES ('${data["input-firstName"]}', '${data["input-middleName"]}', '${data["input-lastName"]}')`;
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
      res.redirect("/authors");
    }
  });
});

app.delete("/delete-author-ajax/", function (req, res, next) {
  let data = req.body;
  let authorId = parseInt(data.id);
  let delete_author = `DELETE FROM authors WHERE authors.authorId = ?`;

  // Run the query
  db.pool.query(delete_author, [authorId], function (error, rows, fields) {
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

  let queryUpdateAuthor = `UPDATE authors SET author.lastName = '${lastName}', author.firstName = '${firstName}', author.middleName = '${middleName}' WHERE authors.authorId = '${id}';`;

  // Run the 1st query
  db.pool.query(queryUpdateAuthor, function (error, rows, fields) {
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    }

    // If there was no error, we run our second query and return that data so we can use it to update the people's
    // table on the front-end
  });
});

// books -------------------------------------------------------------------------------------------------------

app.get("/books", function (req, res) {
  let query1;
  let query2 = `SELECT authors.authorId AS id, CONCAT(authors.lastName, ', ', authors.firstName, IFNULL(CONCAT(' ', authors.middleName), "")) AS author, authors.firstName, authors.middleName, authors.lastName FROM authors ORDER BY authors.lastName;`;

  // If there is no query string, we just perform a basic SELECT
  if (req.query.title === undefined) {
    query1 =
      "SELECT books.bookId AS id, books.title, CONCAT(authors.lastName, ', ',authors.firstName, ' ', IFNULL(authors.middleName, '')) AS author, stockQuantity AS quantity, CONCAT('$', (unitPrice)) AS price FROM books LEFT JOIN authorsBooks ON books.bookId = authorsBooks.FK_books_bookId LEFT JOIN authors ON authorsBooks.FK_authors_authorId = authors.authorId ORDER BY books.title;"; // Define our query
  } else {
    query1 = `SELECT books.bookId AS id, books.title, CONCAT(authors.lastName, ', ',authors.firstName, ' ', IFNULL(authors.middleName, '')) AS author, stockQuantity AS quantity, CONCAT('$', (unitPrice)) AS price FROM books LEFT JOIN authorsBooks ON books.bookId = authorsBooks.FK_books_bookId LEFT JOIN authors ON authorsBooks.FK_authors_authorId = authors.authorId WHERE books.title LIKE "${req.query.title}%" ORDER BY books.title;`;
  }

  db.pool.query(query1, function (error, rows, fields) {
    // Execute the query
    let books = rows;

    db.pool.query(query2, (error, rows, fields) => {
      let authors = rows;

      return res.render("books", { data: books, dropDown: authors });
    });
  });
});

app.post("/add-book-form", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // handle titles with ' inside them
  let title = `${data["input-title"]}`;

  // Create the query and run it on the database
  let query1 = `INSERT INTO books (title, stockQuantity, unitPrice) VALUES ("${title}", '${data["input-quantity"]}', '${data["input-price"]}')`;
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
      res.redirect("/books");
    }
  });
});

app.delete("/delete-book-ajax/", function (req, res, next) {
  let data = req.body;
  let bookId = parseInt(data.id);
  let delete_books = `DELETE FROM books WHERE books.bookId = ?`;

  // Run the 1st query
  db.pool.query(delete_books, [bookId], function (error, rows, fields) {
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    }
  });
});

// customers -------------------------------------------------------------------------------------------------------

app.get("/customers", function (req, res) {
  let query1 =
    "SELECT customers.customerId AS id, customers.lastName AS last, customers.firstName AS first, customers.email AS email FROM customers ORDER BY customers.lastName ASC;";

  db.pool.query(query1, function (error, rows, fields) {
    // Execute the query

    res.render("customers", { data: rows });
  });
});

app.post("/add-customer-form", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Create the query and run it on the database
  query1 = `INSERT INTO customers (firstName, lastName, email) VALUES ('${data["input-firstName"]}', '${data["input-lastName"]}', '${data["input-email"]}')`;
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
      res.redirect("/customers");
    }
  });
});

app.delete("/delete-customer-ajax/", function (req, res, next) {
  let data = req.body;
  let customerId = parseInt(data.id);
  let delete_customer = `DELETE FROM customers WHERE customers.customerId = ?`;

  // Run the query
  db.pool.query(delete_customer, [customerId], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.redirect("/customers");
    }
  });
});

// purchases -------------------------------------------------------------------------------------------------------

app.get("/purchases", function (req, res) {
  let query1 =
    "SELECT purchases.purchaseId AS id, purchases.purchaseDate AS date, CONCAT(customers.lastName,', ', customers.firstName) AS customer, CONCAT(staff.lastName,', ', staff.firstName) AS 'staff', books.title, purchaseBookDetails.quantity AS 'copies', CONCAT('$', (books.unitPrice * purchaseBookDetails.quantity)) AS total FROM purchases LEFT JOIN staff ON purchases.FK_staff_staffId = staff.staffId LEFT JOIN customers ON purchases.FK_customers_customerId = customers.customerId LEFT JOIN purchaseBookDetails ON purchases.purchaseId = purchaseBookDetails.FK_purchases_purchaseId LEFT JOIN books ON purchaseBookDetails.FK_books_bookId = books.bookId ORDER BY purchases.purchaseDate ASC;";
  let query2 =
    "SELECT customers.customerId AS id, CONCAT(customers.lastName, ', ', customers.firstName) AS customer FROM customers ORDER BY customers.lastName;";
  let query3 =
    "SELECT staff.staffId AS id, CONCAT(staff.lastName, ', ', staff.firstName) AS staff FROM staff ORDER BY staff.lastName;";

  db.pool.query(query1, function (error, rows, fields) {
    // Execute the query
    let purchases = rows;

    db.pool.query(query2, (error, rows, fields) => {
      let customers = rows;

      db.pool.query(query3, (error, rows, fields) => {
        let staff = rows;

        return res.render("purchases", {
          data: purchases,
          dropDown1: customers,
          dropDown2: staff,
        });
      });
    });
  });
});

app.post("/add-purchase-form", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // handle null staff values
  let staff = `${data["select-staff"]}`;

  if (staff == "") {
    staff = "NULL";
  }

  // Create the query and run it on the database
  let query1 = `INSERT INTO purchases (purchaseDate, FK_staff_staffId, FK_customers_customerId) VALUES ('${data["input-purchaseDate"]}', ${staff}, '${data["select-customer"]}')`;
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
      res.redirect("/purchases");
    }
  });
});

app.delete("/delete-purchase-ajax/", function (req, res, next) {
  let data = req.body;
  let purchaseId = parseInt(data.id);
  let delete_purchase = `DELETE FROM purchases WHERE purchases.purchaseId = ?`;

  // Run the query
  db.pool.query(delete_purchase, [purchaseId], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.redirect("/purchases");
    }
  });
});

// staff -------------------------------------------------------------------------------------------------------

app.get("/staff", function (req, res) {
  let query1 =
    "SELECT staff.staffId AS id, staff.lastName AS last, staff.firstName AS first, staff.email AS email FROM staff ORDER BY staff.lastName ASC;";

  db.pool.query(query1, function (error, rows, fields) {
    // Execute the query

    res.render("staff", { data: rows });
  });
});

app.post("/add-staff-form", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Create the query and run it on the database
  query1 = `INSERT INTO staff (firstName, lastName, email) VALUES ('${data["input-firstName"]}', '${data["input-lastName"]}', '${data["input-email"]}')`;
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
      res.redirect("/staff");
    }
  });
});

app.delete("/delete-staff-ajax/", function (req, res, next) {
  let data = req.body;
  let staffId = parseInt(data.id);
  let delete_staff = `DELETE FROM staff WHERE staff.staffId = ?`;

  // Run the query
  db.pool.query(delete_staff, [staffId], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.redirect("/staff");
    }
  });
});

// authorsBooks -------------------------------------------------------------------------------------------------------

app.get("/authorsBooks", function (req, res) {
  let query1 =
    "SELECT authorBookId AS id, FK_authors_authorId AS author_id, CONCAT(authors.lastName, ', ', authors.firstName, ' ', IFNULL(authors.middleName, '')) AS author, FK_books_bookId AS book_id, books.title FROM authorsBooks JOIN authors ON authorsBooks.FK_authors_authorId = authors.authorId JOIN books ON authorsBooks.FK_books_bookId = books.bookId ORDER BY authors.lastName, books.title;";
  let query2 =
    "SELECT authors.authorId AS id, CONCAT(authors.lastName, ', ', authors.firstName, ' ', IFNULL(authors.middleName, '')) AS author FROM authors ORDER BY authors.lastName;";
  let query3 =
    "SELECT books.bookId AS id, books.title FROM books ORDER BY books.title;";

  db.pool.query(query1, function (error, rows, fields) {
    // Execute the query

    let authorsBooks = rows;

    db.pool.query(query2, (error, rows, fields) => {
      let authors = rows;

      db.pool.query(query3, (error, rows, fields) => {
        let books = rows;

        return res.render("authorsBooks", {
          data: authorsBooks,
          dropDown1: authors,
          dropDown2: books,
        });
      });
    });
  });
});

app.post("/add-authorBook-form", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Create the query and run it on the database
  query1 = `INSERT INTO authorsBooks (FK_books_bookId, FK_authors_authorId) VALUES ('${data["select-book"]}', '${data["select-author"]}')`;
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
      res.redirect("/authorsBooks");
    }
  });
});

// purchaseBookDetails -------------------------------------------------------------------------------------------------------

app.get("/purchaseBookDetails", function (req, res) {
  let query1 =
    "SELECT purchaseBookDetails.detailId AS id, purchaseBookDetails.FK_purchases_purchaseId AS purchase_id, purchases.purchaseDate AS date, CONCAT(customers.lastName, ', ', customers.firstName) AS customer, CONCAT(staff.lastName, ', ', staff.firstName) AS staff, purchaseBookDetails.quantity, purchaseBookDetails.FK_books_bookId AS book_id, books.title FROM purchaseBookDetails LEFT JOIN books ON purchaseBookDetails.FK_books_bookId = books.bookId LEFT JOIN purchases ON purchaseBookDetails.FK_purchases_purchaseId = purchases.purchaseId LEFT JOIN customers ON purchases.FK_customers_customerId = customers.customerId LEFT JOIN staff ON purchases.FK_staff_staffId = staff.staffId ORDER BY purchases.purchaseDate;";
  let query2 =
    "SELECT purchases.purchaseId AS id, purchases.purchaseDate AS date, CONCAT(customers.lastName, ', ', customers.firstName) AS customer FROM purchases JOIN customers ON purchases.FK_customers_customerId = customers.customerId ORDER BY purchases.purchaseDate;";
  let query3 =
    "SELECT books.bookId AS id, books.title FROM books ORDER BY books.title;";

  db.pool.query(query1, function (error, rows, fields) {
    // Execute the query

    let purchaseDetails = rows;

    db.pool.query(query2, (error, rows, fields) => {
      let customers = rows;

      db.pool.query(query3, (error, rows, fields) => {
        let books = rows;

        return res.render("purchaseBookDetails", {
          data: purchaseDetails,
          dropDown1: customers,
          dropDown2: books,
        });
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
