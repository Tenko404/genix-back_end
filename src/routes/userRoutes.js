const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerUser } = require('../controllers/userController');

// Middleware de validação
const validateRegistration = [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('profilePhoto').isURL().withMessage('Valid profile photo URL is required'),
    body('genres').isArray().withMessage('Genres must be an array').notEmpty().withMessage('At least one genre is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// registra o usuario
router.post('/register', validateRegistration, registerUser);

module.exports = router;

