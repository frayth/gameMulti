import { Socket } from "socket.io";

declare module "socket.io" {
  interface Socket {
    decoded?: Decoded;
    firstConnect?: boolean;
    onError:boolean;
  }
}

export interface Decoded{
  key:string;
  iat:number; 
  exp:number;
}