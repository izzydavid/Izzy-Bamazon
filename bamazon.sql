-- Drops the programming_db if it already exists --
DROP DATABASE IF EXISTS bamazon_db;
-- Create a database called programming_db --
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT AUTO_INCREMENT NOT NULL, 
  product_name VARCHAR(250),
  department_name VARCHAR (250), 
  price DECIMAL (10,2) NULL, 
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
); 

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES (1, "Crayola Crayons", "Toys & Games", 2.59, 3);   
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES (2, "Fire TV Stick", "Electronics", 39.99, 100);   
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES (3, "Wyze Cam", "Camera & Photo", 25.98, 32);   
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES (4, "PlayStation Gift Card", "Video Games", 10, 78);   
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES (5, "Beloved", "Books", 12.53, 59);   
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES (6, "DB MOON Tshirt Dresses", "Clothing, Shoes & Jewelry", 20.99, 429);  
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES (7, "Apple AirPods", "Cell Phones & Accessories", 144.99, 4);   
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES (8, "Here To Stay", " Kindle Store", 5.57, 999);   
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES (9, "Pokemon Detective Pikachu", "Movies & TV", 24.96, 82);   
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES (10, "Thermos Funtainer 10 Ounce", "Kitchen & Dining", 16.24, 63);   



CREATE TABLE departments (
  department_id INT AUTO_INCREMENT NOT NULL, 
  department_name VARCHAR(50),
  over_head_costs DECIMAL (10,2) NULL, 
  PRIMARY KEY (department_id)
); 

INSERT INTO departments (department_id, department_name, over_head_costs) 
VALUES (1, "Toys & Games", 3000.00);   
INSERT INTO departments (department_id, department_name, over_head_costs) 
VALUES (2, "Electronics", 55000.00);   
INSERT INTO departments (department_id, department_name, over_head_costs) 
VALUES (3, "Camera & Photo", 11209.98);   
INSERT INTO departments (department_id, department_name, over_head_costs) 
VALUES (4, "Video Games", 4000.00);   
INSERT INTO departments (department_id, department_name, over_head_costs) 
VALUES (5, "Books", 3200.00);   
INSERT INTO departments (department_id, department_name, over_head_costs) 
VALUES (6, "Clothing, Shoes & Jewelry", 3800.00);   
INSERT INTO departments (department_id, department_name, over_head_costs) 
VALUES (7, "Cell Phones & Accessories", 2500.00);   
INSERT INTO departments (department_id, department_name, over_head_costs) 
VALUES (8, "Kindle Store", 4500.00);   
INSERT INTO departments (department_id, department_name, over_head_costs) 
VALUES (9, "Movies & TV", 6800.00);   
INSERT INTO departments (department_id, department_name, over_head_costs) 
VALUES (10, "Kitchen & Dining", 7500.00);   


SELECT * FROM bamazon_db.departments; 
SELECT * FROM bamazon_db.products;