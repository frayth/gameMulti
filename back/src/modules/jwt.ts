import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Decoded } from "../models/custom.socket";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || "secret";

export const generateToken = ( key: string): string => {
  return jwt.sign({ key }, SECRET_KEY,{
    expiresIn:'24h',
    
  });
};

export const verifyToken = (token: string): Decoded => {
  return jwt.verify(token, SECRET_KEY) as Decoded;
};