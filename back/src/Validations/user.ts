import {body, header}  from 'express-validator';

export const loginValidation = [body('username').notEmpty().trim().escape().withMessage('Invalid email'),header('Authorization').notEmpty().trim().escape().withMessage('Invalid token')];