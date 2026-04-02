const express = require('express');

const authRoutes = require('./auth.routes');
const postRoutes = require('./posts.routes');

const router = express.Router();

router.get('/health', function (req, res) {
  res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);

module.exports = router;

