import { UsersService } from "../services/users.service.js";

export const UsersController = {

  async getUsers(req, res) {
    try {
      const users = await UsersService.getAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getUser(req, res) {
    try {
      const user = await UsersService.getById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateRole(req, res) {
    try {
      const { role } = req.body;
      if (!["student", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      const user = await UsersService.updateRole(req.params.id, role);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async deleteUser(req, res) {
    try {
      await UsersService.delete(req.params.id);
      res.json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // NUEVO: crear usuario individual
  async createUser(req, res) {
    try {
      const { email, name, avatar_url, role } = req.body;
      if (!email || !name) {
        return res.status(400).json({ message: "Email and name are required" });
      }
      const user = await UsersService.create({ email, name, avatar_url, role });
      res.status(201).json(user);
    } catch (err) {
      if (err.message === 'Email already exists') {
        return res.status(409).json({ message: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  },

  // NUEVO: actualizar usuario (nombre, email, avatar)
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      // No permitir actualizar role aquí (usar /role aparte)
      if (updates.role) {
        return res.status(400).json({ message: "Role cannot be updated via this endpoint. Use /role instead." });
      }
      const updated = await UsersService.update(id, updates);
      res.json(updated);
    } catch (err) {
      if (err.message === 'User not found') {
        return res.status(404).json({ message: err.message });
      }
      if (err.message === 'No valid fields to update') {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  },

  // NUEVO: creación masiva
  async createUsersBulk(req, res) {
    try {
      const { users } = req.body; // esperamos { users: [...] }
      if (!users || !Array.isArray(users)) {
        return res.status(400).json({ message: "Invalid request: expected { users: [] }" });
      }
      const inserted = await UsersService.createBulk(users);
      res.status(201).json({ message: `${inserted.length} users created`, users: inserted });
    } catch (err) {
      if (err.message.includes('Email already exists')) {
        return res.status(409).json({ message: err.message });
      }
      res.status(500).json({ error: err.message });   
    }
  }
};