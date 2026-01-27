const express = require('express');
const serviceController = require('../controllers/serviceController');
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
 *             required:
 *               - serviceName
 *               - duration
 *               - requiredStaffType
 *             properties:
 *               serviceName:
 *                 type: string
 *               duration:
 *                 type: number
 *                 enum: [15, 30, 60]
 *               requiredStaffType:
 *                 type: string
 *                 enum: [Doctor, Consultant, Support Agent]
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service created successfully
 */
router.get('/', authMiddleware, serviceController.getAllServices);
router.post('/', authMiddleware, serviceController.createService);

/**
 * @swagger
 * /api/v1/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags:
 *       - Services
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
 *         description: Service details
 *   put:
 *     summary: Update service
 *     tags:
 *       - Services
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
 *         description: Service updated successfully
 *   delete:
 *     summary: Delete service
 *     tags:
 *       - Services
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
 *         description: Service deleted successfully
 */
router.get('/:id', authMiddleware, serviceController.getServiceById);
router.put('/:id', authMiddleware, serviceController.updateService);
router.delete('/:id', authMiddleware, serviceController.deleteService);

module.exports = router;
