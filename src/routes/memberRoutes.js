const express = require('express');
const Member = require('../models/Member');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/v1/member', authMiddleware, async (req, res) => {
  const { community, user, role } = req.body;
  const newMember = await Member.create({ community, user, role });

  res.status(201).json({ status: true, content: { data: newMember } });
});

router.delete('/v1/member/:id', authMiddleware, async (req, res) => {
  await Member.findOneAndDelete({ id: req.params.id });
  res.json({ status: true, message: "Member removed successfully" });
});

module.exports = router;
