import { NextFunction, Request, Response, response } from "express";
import {loginValidation} from "../Validations/user"
import {Result, validationResult}  from 'express-validator';
import { usersList } from "../class/usersList";
import { forbiddenName } from "../assets/forbidenName";
var express = require('express');
var router = express.Router();


router.use(function timeLog(req:Request, res:Response, next:NextFunction) {
  console.log('Time: ', Date.now());
  next();
});

router.post('/login',loginValidation, function(req:Request, res:Response) {
    const result:Result=validationResult(req);
    if(!result.isEmpty()){
      return res.status(400).json({errors:result})
    }
    const invalidName=forbiddenName.find((name):boolean=>{
      return name===req.body.username.toLowerCase();
    });
    const userAlreadyUsed=usersList.checkName(req.body.username) || invalidName;
    res.json({ response:!userAlreadyUsed });
});



export default router;