-- check if user is created
SELECT * FROM users WHERE email = 'test@example.com';

-- check if order is created
SELECT * FROM orders ORDER BY id DESC LIMIT 1;

-- check order status transition
SELECT id, status, updated_at FROM orders WHERE id = [ORDER_ID];

-- check referential integrity
SELECT u.name as sender_name, o.id as order_id 
FROM users u 
JOIN orders o ON u.id = o.sender_id 
WHERE o.id = [ORDER_ID];
