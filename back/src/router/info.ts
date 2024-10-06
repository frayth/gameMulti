import { timeOutListUser } from "../class/timeOutList";
import { usersList } from "../class/usersList";
import {rooms} from '../rooms'
import {Request,Response} from 'express';
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

export default router;