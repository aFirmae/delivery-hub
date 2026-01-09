CREATE DATABASE IF NOT EXISTS delivery_hub;
USE delivery_hub;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  user_type ENUM('sender', 'delivery_partner') DEFAULT 'sender',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  delivery_partner_id INT,
  package_description VARCHAR(500),
  pickup_address VARCHAR(500) NOT NULL,
  delivery_address VARCHAR(500) NOT NULL,
  amount DECIMAL(10, 2),
  status ENUM('pending', 'assigned', 'in_transit', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (delivery_partner_id) REFERENCES users(id)
);
