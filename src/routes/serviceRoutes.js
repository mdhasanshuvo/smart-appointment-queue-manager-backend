const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/v1/services:
 *   get:
 *     summary: Get all services
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of services
 *   post:
 *     summary: Create a new service
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Service created successfully
 */
router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'Service routes coming soon' });
});

router.post('/', authMiddleware, (req, res) => {
  res.json({ message: 'Service routes coming soon' });
});

module.exports = router;
