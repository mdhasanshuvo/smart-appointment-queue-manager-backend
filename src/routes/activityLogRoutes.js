const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/v1/activity-logs:
 *   get:
 *     summary: Get activity logs
 *     tags:
 *       - Activity Logs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of activity logs
 */
router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'Activity logs routes coming soon' });
});

module.exports = router;
