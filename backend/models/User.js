const db = require('../db/db');

class User {
  static async create(user) {
    const { email, password, name, phone, user_type } = user;
    
    // Generate custom ID: USR + Random(5 chars) + Timestamp
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const timestamp = Date.now().toString();
    const id = `USR${randomStr}${timestamp}`;

    const [result] = await db.execute(
      'INSERT INTO users (id, email, password, name, phone, user_type) VALUES (?, ?, ?, ?, ?, ?)',
      [id, email, password, name, phone, user_type]
    );
    return id;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = User;
