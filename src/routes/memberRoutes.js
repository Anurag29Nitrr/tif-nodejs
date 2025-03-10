const express = require('express');
const Member = require('../models/Member');
const Community = require('../models/Community');
const Role = require('../models/Role');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Add Member
router.post('/v1/member', authMiddleware, async (req, res) => {
  const { community, user, role } = req.body;

  if (!community || !user || !role) {
    return res.status(400).json({ status: false, error: { message: 'INVALID_INPUT' } });
  }

  try {
    const requesterMembership = await Member.findOne({ community, user: req.user.id }).populate('role');
    if (!requesterMembership || requesterMembership.role.name !== 'Community Admin') {
      return res.status(403).json({ status: false, error: { message: 'NOT_ALLOWED_ACCESS' } });
    }

    const memberExists = await Member.findOne({ community, user });
    if (memberExists) {
      return res.status(400).json({ status: false, error: { message: 'MEMBER_ALREADY_EXISTS' } });
    }

    const member = await Member.create({ community, user, role });
    res.status(201).json({
      status: true,
      content: { data: { id: member.id, community, user, role, created_at: member.created_at } },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: { message: 'INTERNAL_SERVER_ERROR' } });
  }
});

// Remove Member
router.delete('/v1/member/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const member = await Member.findOne({ id }).populate('community');
    if (!member) {
      return res.status(404).json({ status: false, error: { message: 'MEMBER_NOT_FOUND' } });
    }

    const requesterMembership = await Member.findOne({ community: member.community.id, user: req.user.id }).populate('role');
    if (!requesterMembership || (requesterMembership.role.name !== 'Community Admin' && requesterMembership.role.name !== 'Community Moderator')) {
      return res.status(403).json({ status: false, error: { message: 'NOT_ALLOWED_ACCESS' } });
    }

    await Member.deleteOne({ id });
    res.json({ status: true, content: { data: null } });
  } catch (err) {
    res.status(500).json({ status: false, error: { message: 'INTERNAL_SERVER_ERROR' } });
  }
});

module.exports = router;