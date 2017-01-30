CREATE TABLE products (
    item_id INTEGER (10),
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,4),
    stock_quantity INTEGER(10)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (1, "Nikon Camera", "Electronics", 300.00, 3000), (2, "Toilet Paper", "Home", 2.50, 10000), (3, "Sun Glasses", "Clothing", 50.00, 7000), (4, "Blueberries", "Food", 3.75, 4000), (5, "Macbook Air", "Electronics", 800.00, 80), (6, "A Really good book", "Books", 12.25, 400), (7, "Dinosaur socks", "Clothing", 10.00, 900), (8, "Picnic Table", "Outdoor", 100.00, 200), (9, "Towel", "Home", 4.50, 15), (10, "Green Tea", "Food", 8.00, 5); 
