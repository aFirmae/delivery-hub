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
    
    const conditions = [];

    if (filters.sender_id) {
      conditions.push('sender_id = ?');
      params.push(filters.sender_id);
    }
    
    if (filters.type === 'active') {
        conditions.push("status IN ('pending', 'assigned', 'in_transit')");
    } else if (filters.type === 'history') {
        conditions.push("status IN ('delivered', 'cancelled')");
    } else if(filters.status) {
        conditions.push('status = ?');
        params.push(filters.status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';

    if(filters.limit) {
         query += ' LIMIT ?';
         params.push(parseInt(filters.limit));
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

  static async cancel(id) {
    const [result] = await db.execute("UPDATE orders SET status = 'cancelled' WHERE id = ? AND status = 'pending'", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Order;
