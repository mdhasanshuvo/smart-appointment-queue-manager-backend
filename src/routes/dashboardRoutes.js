const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/v1/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/stats', authMiddleware, dashboardController.getDashboardStats);

/**
 * @swagger
 * /api/v1/dashboard/appointments-by-date:
 *   get:
 *     summary: Get appointments for a specific date
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Appointments for the date
 */
router.get('/appointments-by-date', authMiddleware, dashboardController.getAppointmentsByDate);

/**
 * @swagger
 * /api/v1/dashboard/appointments-by-staff:
 *   get:
 *     summary: Get appointments for a staff member on a date
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: staffId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Appointments for the staff member
 */
router.get('/appointments-by-staff', authMiddleware, dashboardController.getAppointmentsByStaff);

module.exports = router;
