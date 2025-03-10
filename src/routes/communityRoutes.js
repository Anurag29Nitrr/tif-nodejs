const express = require('express');
const Community = require('../models/Community');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/v1/community', authMiddleware, async (req, res) => {
  const { name, slug } = req.body;
  const newCommunity = await Community.create({ name, slug, owner: req.user.id });

  res.status(201).json({ status: true, content: { data: newCommunity } });
});

router.get('/v1/community', async (req, res) => {
  const communities = await Community.find();
  res.json({ status: true, content: { data: communities } });
});

module.exports = router;
