const db = require('../db/db');

class Order {
  static async create(order) {
    const { sender_id, package_description, pickup_address, delivery_address, amount } = order;
    const [result] = await db.execute(
      'INSERT INTO orders (sender_id, package_description, pickup_address, delivery_address, amount, status) VALUES (?, ?, ?, ?, ?, ?)',
      [sender_id, package_description, pickup_address, delivery_address, amount, 'pending']
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM orders';
    const params = [];
    
    if (filters.sender_id) {
      query += ' WHERE sender_id = ?';
      params.push(filters.sender_id);
    } else {
        // If filters exist but not sender_id, we need to handle WHERE clause correctly
        // For simplicity in this scope, let's assume if there are other filters we append with AND/WHERE
        // But the requirement says: "Admin sees all; users see only their own."
        // We will handle logic in controller/route
    }
    
    // Simple implementation for list orders
    if (Object.keys(filters).length > 0) {
        if(!query.includes('WHERE')) query += ' WHERE 1=1';
        if(filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }
        if(filters.limit) {
             query += ' LIMIT ?';
             params.push(parseInt(filters.limit));
        }
    }

    const [rows] = await db.execute(query, params);
    return rows;
  }
  
  static async updateStatus(id, status, delivery_partner_id) {
      // If delivery_partner_id is provided, we update it too (assigning order)
      let query = 'UPDATE orders SET status = ?';
      const params = [status];
      
      if(delivery_partner_id) {
          query += ', delivery_partner_id = ?';
          params.push(delivery_partner_id);
      }
      
      query += ' WHERE id = ?';
      params.push(id);
      
      const [result] = await db.execute(query, params);
      return result.affectedRows > 0;
  }
}

module.exports = Order;
