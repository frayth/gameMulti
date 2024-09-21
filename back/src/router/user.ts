import { NextFunction, Request, Response, response } from "express";
import {loginValidation,historyRequestValidation} from "../Validations/user"
import {verifyToken} from "../modules/jwt"
import {Result, validationResult}  from 'express-validator';
import { usersList } from "../class/usersList";
import { forbiddenName } from "../assets/forbidenName";
import questionList from "../assets/question.json";
import {rooms} from "../rooms";
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

interface Query{
  room:number
}
router.get('/history',historyRequestValidation, function(req:Request<{},{},{},Query>, res:Response) {
 interface History{
    question:string,
    usersInfo:{
      userResponse:string,
      answerIsCorrect:boolean,
      user:number,
    }[]
  }
    const result:Result=validationResult(req);
    const roomID=Number(req.query.room);
    if(!result.isEmpty()){
      return res.status(400).json({errors:result})
    }
    const token=req.header('Authorization');
    const user=verifyToken(token!);
    if(!user){
      return res.status(401).json({errors:"Invalid token"})
    }
    const room=rooms.getRoom(roomID);
    if(!room){
      return res.status(404).json({errors:"Room not found"})
    }
    const history=room.game?.history.map((turn):History=>{
      const question=questionList.find((q)=>{
        return q.id===turn.id;
      });
      if(!question)return {
        question:"Question not found",
        usersInfo:[]
      }
      return {
        question:question.question,
        usersInfo:turn.historyUser.map((user)=>{
          return {
            userResponse:question.answers.find((a)=>a.id===user.response)?.value || "Answer not found",
            answerIsCorrect:user.response===question.response,
            user:user.id
          }
        })
      }
    });
    res.json({ response:history});
});

export default router;