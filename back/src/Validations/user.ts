
import {body, header,query}  from 'express-validator';
export const getValidation=[header('Authorization').notEmpty().trim().escape().withMessage('Invalid token')]
export const loginValidation = [body('username').notEmpty().trim().escape().withMessage('Invalid email'),...getValidation];
export const  historyRequestValidation = [...getValidation,query('room').notEmpty().trim().escape().isInt().withMessage('Invalid room')];
export const settingsValidation = [
  body('goodResponse').notEmpty().trim().escape().isInt().withMessage('Invalid goodResponse'),
  body('fasterResponse').notEmpty().trim().escape().isInt().withMessage('Invalid fasterResponse'),
  body('badResponse').notEmpty().trim().escape().isInt().withMessage('Invalid badResponse'),
  body('numberOfStreakForBonus').notEmpty().trim().escape().isInt().withMessage('Invalid numberOfStreakForBonus'),
  body('fasterBadResponse').notEmpty().trim().escape().isInt().withMessage('Invalid fasterBadResponse'),
  body('noResponse').notEmpty().trim().escape().isInt().withMessage('Invalid noResponse'),
  body('defautScore').notEmpty().trim().escape().isInt().withMessage('Invalid defautScore'),
  body('responseTime').notEmpty().trim().escape().isInt().withMessage('Invalid responseTime'),...getValidation];