const express = require('express');
const Role = require('../models/Role');

const router = express.Router();

//  Create a Role
router.post('/v1/role', async (req, res) => {
  try {
    const { name } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ error: "Role already exists" });
    }

    const newRole = await Role.create({ name });

    res.status(201).json({
      status: true,
      content: { data: newRole }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//  Get All Roles
router.get('/v1/role', async (req, res) => {
  try {
    const roles = await Role.find();

    res.status(200).json({
      status: true,
      content: { data: roles }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
