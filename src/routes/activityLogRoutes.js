const express = require('express');
const activityLogController = require('../controllers/activityLogController');
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
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of activity logs
 */
router.get('/', authMiddleware, activityLogController.getActivityLogs);

module.exports = router;
