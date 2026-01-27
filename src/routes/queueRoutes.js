const express = require('express');
const queueController = require('../controllers/queueController');
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
router.get('/', authMiddleware, queueController.getWaitingQueue);

/**
 * @swagger
 * /api/v1/queue/assign:
 *   post:
 *     summary: Assign next appointment from queue to staff
 *     tags:
 *       - Queue
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - staffId
 *             properties:
 *               staffId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment assigned from queue successfully
 */
router.post('/assign', authMiddleware, queueController.assignFromQueue);

/**
 * @swagger
 * /api/v1/queue/count:
 *   get:
 *     summary: Get waiting queue count
 *     tags:
 *       - Queue
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Queue count
 */
router.get('/count', authMiddleware, queueController.getQueueCount);

/**
 * @swagger
 * /api/v1/queue/position:
 *   get:
 *     summary: Get queue position for an appointment
 *     tags:
 *       - Queue
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Queue position information
 */
router.get('/position', authMiddleware, queueController.getQueuePosition);

module.exports = router;
