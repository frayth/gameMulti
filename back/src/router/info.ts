import { timeOutListUser } from "../class/timeOutList";
import { usersList } from "../class/usersList";
import {rooms} from '../rooms'
import {Request,Response} from 'express';
import { getValidation } from "../Validations/user";
import bonus from '../assets/bonus.json'
import { validationResult } from "express-validator";
import { verifyToken } from "../modules/jwt";
import type { optionsGameModel } from '../models/game.model';
import { GameRoom } from "../class/GameRoom";
var express = require('express');
var router = express.Router();

router.get('/',function(req:Request,res:Response){
  res.json({
    rooms:rooms.getAllParsedRooms().map((room)=>{
      return {
        id:room.id,
        name:room.name,
        players:room.players
      }
    }),
    users:usersList.getUserList().map((user)=>{
      return {
        id:user.id,
        name:user.name
      }
    }),
    timeOutList:timeOutListUser.get().map((timeout)=>{
      return {
        id:timeout.player.id,
        name:timeout.player.name,
      }
    })
  })
})

router.get('/optionsGame',getValidation,function(req:Request,res:Response<optionsGameModel | {errors:any}>){
  const result=validationResult(req);
  const query=req.query.reset;

  if(!result.isEmpty()){
    return res.status(400).json({errors:result})
  }
  const token=req.header('Authorization');
  const user=verifyToken(token!);
  if(!user){
    return res.status(401).json({errors:"Invalid token"})
  }
  const player=usersList.getUserByKey(user.key);
  if(!player){
    return res.status(404).json({errors:"User not found"})
  }
  if(query){
    return res.json(bonus)
  }
  if(player.room.room instanceof GameRoom)
  return res.json(player.room.room?.optionsGame || bonus)

})

export default router;