import express from "express";
import cors from "cors";
export const app = express();
import userRouter from "./router/user";
import infoRouter from "./router/info";
import gameRouter from "./router/game";
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(express.json());
app.use(cors());
app.use('/user',userRouter);
app.use('/info',infoRouter);
app.use('/game',gameRouter);

