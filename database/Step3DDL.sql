-- Group 45
-- Team Members: Aidan Mackenzie, Jillian Vondy
-- Project Step 3

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- ------------------------------------------
-- Create authors table
-- ------------------------------------------

CREATE OR REPLACE TABLE authors (
    authorId int(11) NOT NULL AUTO_INCREMENT,
    firstName varchar(50) NOT NULL,
    middleName varchar(50) DEFAULT NULL,
    lastName varchar(50) NOT NULL,
    PRIMARY KEY (authorId)
);

-- ------------------------------------------
-- Create books table
-- ------------------------------------------

CREATE OR REPLACE TABLE books (
    bookId int(11) NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    stockQuantity int(11) NOT NULL,
    unitPrice decimal(6,2) NOT NULL,
    PRIMARY KEY (bookId)
);

-- ------------------------------------------
-- Create authorsBooks table
-- ------------------------------------------

CREATE OR REPLACE TABLE authorsBooks (
    authorBookId int(11) NOT NULL AUTO_INCREMENT,
    FK_books_bookId int(11) NOT NULL,
    FK_authors_authorId int(11) NOT NULL,
    PRIMARY KEY (authorBookId),
    FOREIGN KEY (FK_books_bookId) REFERENCES books(bookId)
    ON DELETE CASCADE,
    FOREIGN KEY (FK_authors_authorId) REFERENCES authors(authorId)
    ON DELETE CASCADE
);

-- ------------------------------------------
-- Create customers table
-- ------------------------------------------

CREATE OR REPLACE TABLE customers (
    customerId int(11) NOT NULL AUTO_INCREMENT,
    firstName varchar(50) NOT NULL,
    lastName varchar(50) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    PRIMARY KEY (customerId)
);

-- ------------------------------------------
-- Create staff table
-- ------------------------------------------

CREATE OR REPLACE TABLE staff (
    staffId int(11) NOT NULL AUTO_INCREMENT,
    firstName varchar(50) NOT NULL,
    lastName varchar(50) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    PRIMARY KEY (staffId)
);

-- ------------------------------------------
-- Create purchases table
-- ------------------------------------------

CREATE OR REPLACE TABLE purchases (
    purchaseId int(11) NOT NULL AUTO_INCREMENT,
    purchaseDate date NOT NULL,
    FK_staff_staffId int(11) DEFAULT NULL,                                              
    FK_customers_customerId int(11) NOT NULL,
    PRIMARY KEY (purchaseId),
    FOREIGN KEY (FK_staff_staffId) REFERENCES staff(staffId)
    ON DELETE CASCADE,
    FOREIGN KEY (FK_customers_customerId) REFERENCES customers(customerId)
    ON DELETE CASCADE
);

-- ------------------------------------------
-- Create purchaseBookDetails table
-- ------------------------------------------

CREATE OR REPLACE TABLE purchaseBookDetails (
    detailId int(11) NOT NULL AUTO_INCREMENT,
    quantity int(11) NOT NULL,
    FK_books_bookId int(11) NOT NULL,
    FK_purchases_purchaseId int(11) NOT NULL,
    PRIMARY KEY (detailId),
    FOREIGN KEY (FK_books_bookId) REFERENCES books(bookId)
    ON DELETE CASCADE,
    FOREIGN KEY (FK_purchases_purchaseId) REFERENCES purchases(purchaseId)
    ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Insert 'authors'
-- -----------------------------------------------------

INSERT INTO authors (firstName, lastName)
VALUES ('Jonathan', 'Stroud'),
('Martha', 'Wells'),
('Robin', 'Sloan'),
('Austin', 'Grossman' );

INSERT INTO authors (firstName, middleName, lastName)
VALUES ('Kim', 'Stanley', 'Robinson');

-- -----------------------------------------------------
-- Insert 'books'
-- -----------------------------------------------------

INSERT INTO books (title, stockQuantity, unitPrice)
VALUES ('All Systems Red', 5, 14.39),
('The Amulet of Samarkand', 4, 9.99 ),
('Sourdough', 12, 9.39),
('New York 2140', 3, 21.48),
('Soon I Will Be Invincible', 4, 8.99),
('Crooked', 7, 12.99);

-- -----------------------------------------------------
-- Insert 'authorsBooks'
-- -----------------------------------------------------

INSERT INTO authorsBooks (FK_books_bookId, FK_authors_authorId)
VALUES (2, 1),
(1, 2),
(3, 3),
(5, 4),
(4, 5),
(6, 4);

-- -----------------------------------------------------
-- Insert 'customers'
-- -----------------------------------------------------

INSERT INTO customers (firstName, lastName, email)
VALUES ('Samien', 'Harkins', 'sam.har@egl-inc.info'),
('Bishop', 'Hochstetler', 'hochste@egl-inc.info'),
('Carey', 'Baumann', 'careybaumann@consolidated-farm-research.net'),
('Eruera', 'Brzezinski', 'erue_br@acusage.net'),
('Shaili', 'Criner', 'shcri@arvinmeritor.info');

-- -----------------------------------------------------
-- Insert 'staff'
-- -----------------------------------------------------

INSERT INTO staff (firstName, lastName, email)
VALUES ('Tierra', 'Whack', 'twhack@gmail.com'),
('Joe', 'Talbot', 'jtalbot@gmail.com'),
('Vince', 'Staples', 'vstaples@gmail.com'),
('Tyler', 'Okonma', 'tokonma@gmail.com'),
('Megan', 'Pete', 'mpete@gmail.com');

-- -----------------------------------------------------
-- Insert 'purchases'
-- -----------------------------------------------------

INSERT INTO purchases (FK_staff_staffId, FK_customers_customerId, purchaseDate)
VALUES (1, 3, '2022-01-04'),
(5, 2, '2022-03-12' ),
(2, 5, '2022-04-14'),
(2, 4, '2022-06-17');

INSERT INTO purchases (FK_customers_customerId, purchaseDate)
VALUES (1, '2022-07-04');

-- -----------------------------------------------------
-- Insert 'purchaseBookDetails'
-- -----------------------------------------------------

INSERT INTO purchaseBookDetails (FK_books_bookId, FK_purchases_purchaseId, quantity)
VALUES (5, 1, 1),
(3, 2, 3),
(2, 3, 2),
(2, 4, 1),
(1, 5, 1),
(6, 5, 5);


SET FOREIGN_KEY_CHECKS=1;
COMMIT;