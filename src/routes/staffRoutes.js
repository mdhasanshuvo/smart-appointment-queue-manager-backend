const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/v1/staff:
 *   get:
 *     summary: Get all staff members
 *     tags:
 *       - Staff
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of staff members
 *   post:
 *     summary: Create a new staff member
 *     tags:
 *       - Staff
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
 *         description: Staff created successfully
 */
router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'Staff routes coming soon' });
});

router.post('/', authMiddleware, (req, res) => {
  res.json({ message: 'Staff routes coming soon' });
});

module.exports = router;
