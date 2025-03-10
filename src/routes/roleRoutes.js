const express = require('express');
const Role = require('../models/Role');

const router = express.Router();

// Create Role
router.post('/v1/role', async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.length > 64) {
    return res.status(400).json({ status: false, error: { message: 'INVALID_INPUT' } });
  }

  try {
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ status: false, error: { message: 'ROLE_ALREADY_EXISTS' } });
    }

    const role = await Role.create({ name });
    res.status(201).json({
      status: true,
      content: { data: { id: role.id, name: role.name, created_at: role.created_at, updated_at: role.updated_at } },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: { message: 'INTERNAL_SERVER_ERROR' } });
  }
});

// Get All Roles
router.get('/v1/role', async (req, res) => {
  try {
    const roles = await Role.find();
    res.json({
      status: true,
      content: { data: roles.map(role => ({ id: role.id, name: role.name, created_at: role.created_at, updated_at: role.updated_at })) },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: { message: 'INTERNAL_SERVER_ERROR' } });
  }
});

module.exports = router;