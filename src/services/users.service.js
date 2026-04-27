import db from "../db.js";

export const UsersService = {

  async getAll() {
    const res = await db.query(`
      SELECT id, email, name, avatar_url, role, created_at
      FROM users
      ORDER BY created_at DESC
    `);
    return res.rows;
  },

  async getById(id) {
    const res = await db.query(
      `SELECT id, email, name, avatar_url, role, created_at
       FROM users WHERE id=$1`,
      [id]
    );
    return res.rows[0];
  },

  async updateRole(id, role) {
    const res = await db.query(
      `UPDATE users SET role=$1 WHERE id=$2 RETURNING id, email, role`,
      [role, id]
    );
    return res.rows[0];
  },

  async delete(id) {
    await db.query(`DELETE FROM users WHERE id=$1`, [id]);
    return true;
  },

  // NUEVO: crear un usuario individual
  async create(userData) {
    const { email, name, avatar_url = null, role = 'student' } = userData;
    // Verificar si el email ya existe
    const existing = await db.query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existing.rows.length > 0) {
      throw new Error('Email already exists');
    }
    const res = await db.query(
      `INSERT INTO users (email, name, avatar_url, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, avatar_url, role, created_at`,
      [email, name, avatar_url, role]
    );
    return res.rows[0];
  },

  // NUEVO: actualizar usuario (solo campos permitidos)
  async update(id, updates) {
    const allowedFields = ['name', 'email', 'avatar_url'];
    const fields = [];
    const values = [];
    let idx = 1;
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        fields.push(`${field} = $${idx}`);
        values.push(updates[field]);
        idx++;
      }
    }
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }
    values.push(id);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING id, email, name, avatar_url, role, created_at
    `;
    const res = await db.query(query, values);
    if (res.rows.length === 0) {
      throw new Error('User not found');
    }
    return res.rows[0];
  },

  // NUEVO: creación masiva
  async createBulk(usersArray) {
    if (!Array.isArray(usersArray) || usersArray.length === 0) {
      throw new Error('Users array is required');
    }
    const client = await db.connect(); // asumiendo que db es el pool, necesitas cliente para transacción
    try {
      await client.query('BEGIN');
      const inserted = [];
      for (const user of usersArray) {
        const { email, name, avatar_url = null, role = 'student' } = user;
        if (!email || !name) {
          throw new Error(`Missing email or name for user: ${JSON.stringify(user)}`);
        }
        // Verificar duplicado individualmente
        const existing = await client.query(`SELECT id FROM users WHERE email = $1`, [email]);
        if (existing.rows.length > 0) {
          throw new Error(`Email already exists: ${email}`);
        }
        const res = await client.query(
          `INSERT INTO users (email, name, avatar_url, role)
           VALUES ($1, $2, $3, $4)
           RETURNING id, email, name, avatar_url, role, created_at`,
          [email, name, avatar_url, role]
        );
        inserted.push(res.rows[0]);
      }
      await client.query('COMMIT');
      return inserted;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
};