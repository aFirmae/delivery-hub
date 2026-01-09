const db = require('../db/db');

class User {
  static async create(user) {
    const { email, password, name, phone, user_type } = user;
    const [result] = await db.execute(
      'INSERT INTO users (email, password, name, phone, user_type) VALUES (?, ?, ?, ?, ?)',
      [email, password, name, phone, user_type]
    );
    return result.insertId;
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
