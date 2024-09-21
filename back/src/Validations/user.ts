
import {body, header,query}  from 'express-validator';

export const loginValidation = [body('username').notEmpty().trim().escape().withMessage('Invalid email'),header('Authorization').notEmpty().trim().escape().withMessage('Invalid token')];
export const  historyRequestValidation = [header('Authorization').notEmpty().trim().escape().isJWT().withMessage('Invalid token'),query('room').notEmpty().trim().escape().isInt().withMessage('Invalid room')];