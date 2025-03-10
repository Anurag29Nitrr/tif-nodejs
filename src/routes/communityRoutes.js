const express = require('express');
const validator = require('validator');
const Community = require('../models/Community');
const Member = require('../models/Member');
const Role = require('../models/Role');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create Community
router.post('/v1/community', authMiddleware, async (req, res) => {
  const { name, slug } = req.body;

  if (!name || !slug || name.length > 128 || slug.length > 255 || !validator.isSlug(slug)) {
    return res.status(400).json({ status: false, error: { message: 'INVALID_INPUT' } });
  }

  try {
    const slugExists = await Community.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({ status: false, error: { message: 'SLUG_ALREADY_EXISTS' } });
    }

    const community = await Community.create({ name, slug, owner: req.user.id });
    const adminRole = await Role.findOne({ name: 'Community Admin' });
    await Member.create({ community: community.id, user: req.user.id, role: adminRole.id });

    res.status(201).json({
      status: true,
      content: { data: { id: community.id, name, slug, owner: req.user.id, created_at: community.created_at, updated_at: community.updated_at } },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: { message: 'INTERNAL_SERVER_ERROR' } });
  }
});

// Get All Communities
router.get('/v1/community', async (req, res) => {
  try {
    const communities = await Community.find().populate('owner', 'id name email');
    res.json({
      status: true,
      content: { data: communities.map(c => ({ id: c.id, name: c.name, slug: c.slug, owner: c.owner, created_at: c.created_at, updated_at: c.updated_at })) },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: { message: 'INTERNAL_SERVER_ERROR' } });
  }
});

// Get All Members of a Community
router.get('/v1/community/:id/members', async (req, res) => {
  const { id } = req.params;

  try {
    const members = await Member.find({ community: id }).populate('user', 'id name email').populate('role', 'id name');
    if (!members.length) {
      return res.status(404).json({ status: false, error: { message: 'COMMUNITY_NOT_FOUND' } });
    }

    res.json({
      status: true,
      content: { data: members.map(m => ({ id: m.id, community: m.community, user: m.user, role: m.role, created_at: m.created_at })) },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: { message: 'INTERNAL_SERVER_ERROR' } });
  }
});

// Get My Owned Communities
router.get('/v1/community/me/owner', authMiddleware, async (req, res) => {
  try {
    const communities = await Community.find({ owner: req.user.id });
    res.json({
      status: true,
      content: { data: communities.map(c => ({ id: c.id, name: c.name, slug: c.slug, owner: c.owner, created_at: c.created_at, updated_at: c.updated_at })) },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: { message: 'INTERNAL_SERVER_ERROR' } });
  }
});

// Get My Joined Communities
router.get('/v1/community/me/member', authMiddleware, async (req, res) => {
  try {
    const memberships = await Member.find({ user: req.user.id }).populate('community', 'id name slug owner created_at updated_at');
    res.json({
      status: true,
      content: { data: memberships.map(m => m.community) },
    });
  } catch (err) {
    res.status(500).json({ status: false, error: { message: 'INTERNAL_SERVER_ERROR' } });
  }
});

module.exports = router;