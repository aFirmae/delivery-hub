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
    const query = `
      SELECT o.*, 
             u.name as delivery_partner_name, 
             u.phone as delivery_partner_phone 
      FROM orders o 
      LEFT JOIN users u ON o.delivery_partner_id = u.id 
      WHERE o.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM orders';
    const params = [];
    
    // ... logic remains same, but maybe simpler to not join here for list unless needed for performance
    // Keeping original logic for findAll to minimize risk, assumed list doesn't need detailed partner info yet
    // If list needs partner info, we can update later. User only asked for "user, which delivery has been assigned..." 
    // which implies Order Details screen.
    
    const conditions = [];

    if (filters.sender_id) {
      conditions.push('sender_id = ?');
      params.push(filters.sender_id);
    }
    
    if (filters.delivery_partner_id) {
        conditions.push('delivery_partner_id = ?');
        params.push(filters.delivery_partner_id);
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

  static async getEarnings(partnerId) {
    // Total Earnings
    const [totalRows] = await db.execute(
        "SELECT SUM(amount) as total FROM orders WHERE delivery_partner_id = ? AND status = 'delivered'", 
        [partnerId]
    );
    
    // Daily Earnings
    const [dailyRows] = await db.execute(
        "SELECT DATE(created_at) as date, SUM(amount) as total FROM orders WHERE delivery_partner_id = ? AND status = 'delivered' GROUP BY DATE(created_at) ORDER BY date DESC",
        [partnerId]
    );

    return {
        total: totalRows[0].total || 0,
        daily: dailyRows
    };
  }
}

module.exports = Order;
