const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/v1/appointments:
 *   get:
 *     summary: Get all appointments
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *   post:
 *     summary: Create a new appointment
 *     tags:
 *       - Appointments
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
 *         description: Appointment created successfully
 */
router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'Appointment routes coming soon' });
});

router.post('/', authMiddleware, (req, res) => {
  res.json({ message: 'Appointment routes coming soon' });
});

module.exports = router;
