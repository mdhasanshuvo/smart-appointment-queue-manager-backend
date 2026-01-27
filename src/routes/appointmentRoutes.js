const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateAppointment, handleValidationErrors } = require('../middleware/validation');

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
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Scheduled, Completed, Cancelled, No-Show]
 *       - in: query
 *         name: appointmentDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: assignedStaff
 *         schema:
 *           type: string
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
 *             required:
 *               - customerName
 *               - service
 *               - appointmentDate
 *               - appointmentTime
 *             properties:
 *               customerName:
 *                 type: string
 *               service:
 *                 type: string
 *               assignedStaff:
 *                 type: string
 *               appointmentDate:
 *                 type: string
 *                 format: date
 *               appointmentTime:
 *                 type: string
 *                 example: "14:30"
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created successfully
 */
router.get('/', authMiddleware, appointmentController.getAllAppointments);
router.post('/', authMiddleware, validateAppointment, handleValidationErrors, appointmentController.createAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment details
 *   put:
 *     summary: Update appointment
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *   delete:
 *     summary: Delete appointment
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 */
router.get('/:id', authMiddleware, appointmentController.getAppointmentById);
router.put('/:id', authMiddleware, appointmentController.updateAppointment);
router.delete('/:id', authMiddleware, appointmentController.deleteAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}/cancel:
 *   post:
 *     summary: Cancel appointment
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 */
router.post('/:id/cancel', authMiddleware, appointmentController.cancelAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}/complete:
 *   post:
 *     summary: Mark appointment as completed
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment marked as completed
 */
router.post('/:id/complete', authMiddleware, appointmentController.completeAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}/no-show:
 *   post:
 *     summary: Mark appointment as no-show
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment marked as no-show
 */
router.post('/:id/no-show', authMiddleware, appointmentController.markNoShow);

module.exports = router;
