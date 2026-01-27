const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/v1/queue:
 *   get:
 *     summary: Get waiting queue
 *     tags:
 *       - Queue
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments in waiting queue
 */
router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'Queue routes coming soon' });
});

module.exports = router;
