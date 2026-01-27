const express = require('express');
const staffController = require('../controllers/staffController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateStaff, handleValidationErrors } = require('../middleware/validation');

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
 *     parameters:
 *       - in: query
 *         name: serviceType
 *         schema:
 *           type: string
 *           enum: [Doctor, Consultant, Support Agent]
 *       - in: query
 *         name: availabilityStatus
 *         schema:
 *           type: string
 *           enum: [Available, On Leave]
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
 *             required:
 *               - name
 *               - serviceType
 *             properties:
 *               name:
 *                 type: string
 *               serviceType:
 *                 type: string
 *                 enum: [Doctor, Consultant, Support Agent]
 *               dailyCapacity:
 *                 type: number
 *                 default: 5
 *               availabilityStatus:
 *                 type: string
 *                 enum: [Available, On Leave]
 *     responses:
 *       201:
 *         description: Staff created successfully
 */
router.get('/', authMiddleware, staffController.getAllStaff);
router.post('/', authMiddleware, validateStaff, handleValidationErrors, staffController.createStaff);

/**
 * @swagger
 * /api/v1/staff/{id}:
 *   get:
 *     summary: Get staff member by ID
 *     tags:
 *       - Staff
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
 *         description: Staff member details
 *   put:
 *     summary: Update staff member
 *     tags:
 *       - Staff
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
 *         description: Staff updated successfully
 *   delete:
 *     summary: Delete staff member
 *     tags:
 *       - Staff
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
 *         description: Staff deleted successfully
 */
router.get('/:id', authMiddleware, staffController.getStaffById);
router.put('/:id', authMiddleware, validateStaff, handleValidationErrors, staffController.updateStaff);
router.delete('/:id', authMiddleware, staffController.deleteStaff);

/**
 * @swagger
 * /api/v1/staff/load/today:
 *   get:
 *     summary: Get staff load for a specific date
 *     tags:
 *       - Staff
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
 *         description: Staff load information
 */
router.get('/load/today', authMiddleware, staffController.getStaffLoad);

/**
 * @swagger
 * /api/v1/staff/load/all:
 *   get:
 *     summary: Get load for all staff members
 *     tags:
 *       - Staff
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
 *         description: Load information for all staff
 */
router.get('/load/all', authMiddleware, staffController.getAllStaffLoad);

module.exports = router;
