var express = require('express');
import {Request,Response} from 'express';
var router = express.Router();
import {settingsValidation} from "../Validations/user"
import type { optionsGameModel } from '../models/game.model';
import { verifyToken } from '../modules/jwt';
import {Result, validationResult}  from 'express-validator';
import { usersList } from '../class/usersList';
import { GameRoom } from '../class/GameRoom';

router.post('/settings',settingsValidation,function(req:Request<{},optionsGameModel>,res:Response){
 const result=validationResult(req);
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
  if(player.room.room?.players[0].id!==player.id){
    return res.status(403).json({errors:"You are not the room owner"})
  }
  if(player.room.room instanceof GameRoom)player.room.room.setOptions(req.body);
  return res.status(200).json({response:"Options setted"})
})
export default router;