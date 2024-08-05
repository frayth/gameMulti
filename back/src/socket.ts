import { app } from "./express";
import { usersList } from "./class/usersList";
import { rooms } from "./rooms";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { verifyToken } from "./modules/jwt";
import { Decoded } from "./models/custom.socket";
import { timeOutListUser } from "./class/timeOutList";
import Player from "./class/player";
import { GameRoom } from "./class/GameRoom";
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  },
  pingInterval: 1000,
  pingTimeout: 1000,
});

const checkTokenMiddleware = (socket: Socket, next: Function) => {
  const token = socket.handshake.auth.token;
  //console.log("checkTokenMiddleware", token);

  if (token === "notToken") {
    socket.firstConnect = true;
    next();
  } else {
    try {
      const decoded = verifyToken(token);
      socket.decoded = decoded;
      const userIsExist = usersList.getUserByKey(decoded.key);
      if (!userIsExist) {
        console.log("user not found after reconnexion");
        socket.onError = true;
      }
      next();
    } catch (e) {
      console.log(e);
      socket.onError = true;
      next();
    }
  }
};

io.use(checkTokenMiddleware);

io.on("connect", (socket: Socket) => {
  console.log("[connect]", socket.id);
  if (socket.onError) {
    socket.emit("error", { message: "An error occurred, please reconnect" });
    socket.disconnect();
    return;
  }
  if (socket.firstConnect) {
    console.log("___________________________________________ first connect");
    const token = usersList.addUser(socket);
    socket.emit("token", token);
  } else {
    try {
      if (socket.decoded) {
        const user = usersList.getUserByKey(socket.decoded.key);
        if (user) {
          user.socket = socket;
          user.sendInfo();
        } else {
          socket.emit("error", { message: "user not found" });
        }
      } else {
        socket.emit("error", { message: "user not found" });
      }
    } catch (e) {
      console.log("coucou", e);
    }
  }

  socket.on("logout:user", (): void => {
    console.log('[socket.ts]',"logout user");
    usersList.removeUser(socket);
  });

  socket.on("startCount:timer", () => {
    console.log('[socket.ts]',"startCount:timer");
    const user = usersList.getUser(socket);
    if (
      user &&
      user.room.room instanceof GameRoom &&
      user.room.room.getOwner() === user.id
    ) {
      user.room.room?.emitToAll("startCount:timer", {});
      user.room.room?.closeEntry();
    }
  });
  socket.on("cancelCount:timer", () => {
    console.log('[socket.ts]',"cancelCount:timer");
    const user = usersList.getUser(socket);
    if (
      user &&
      user.room.room instanceof GameRoom &&
      user.room.room.getOwner() === user.id
    ) {
      user.room.room?.emitToAll("cancelCount:timer", {});
      user.room.room?.openEntry();
    }
  });
  socket.on("lauchGame:room", () => {
    console.log('[socket.ts]',"lauchGame:room");
    const user = usersList.getUser(socket);
    if (
      user &&
      user.room.room instanceof GameRoom &&
      user.room.room.getOwner() === user.id
    ) {
      user.room.room?.startGame();
    }
  });
  socket.on('response:game', (data: {response:number | null}) => {
    console.log('[socket.ts]',"response:game",data);
    const user = usersList.getUser(socket);
    if (user && user.room.room instanceof GameRoom) {
      console.log('savePlayerResponse',user.name)
        user.room.room.game?.savePlayerResponse(user, data);
    }
  });
  socket.on("getRooms:rooms", () => {
    console.log('[socket.ts]',"getRooms:rooms");
    const list = rooms.getAllParsedRooms();
    socket.emit("list:room", list);
  });
  socket.on("create:room", () => {
    console.log('[socket.ts]',"create:room");
    const user = usersList.getUser(socket);
    if (user && user.canJoinRoom()) {
      const newRoom = new GameRoom(
        rooms.listOfRooms[rooms.listOfRooms.length - 1].id + 1,
        `room de ${user.name}`
      );
      rooms.addRoom(newRoom);
      user.setRoom(`room de ${user.name}`, newRoom);
    }
  });
  socket.on("leave:room", () => {
    console.log('[socket.ts]',"leave:room");
    const user = usersList.getUser(socket);
    if (user && !user.canJoinRoom()) {
      user.leaveRoom();
    }
  });
  socket.on("getInfoGame:room", () => {
    console.log('[socket.ts]',"getInfoGame:room");
    const user = usersList.getUser(socket);
    if (user && user.room.room instanceof GameRoom) {
      user.room.room?.sendInfoGame();
    }
  });
  socket.on("kick:player", (id: number) => {
    console.log('[socket.ts]',"kick:player");
    const user = usersList.getUser(socket);
    if (user && user.room.room instanceof GameRoom) {
      const roomOwner = user.room.room.getOwner();
      if (user.id === roomOwner) {
        const player = user.room.room.getPlayer(id);
        if (player) {
          player.leaveRoom();
        }
      }
    }
  });
  socket.on("join:room", (data: { id: number }) => {
    console.log('[socket.ts]',"join:room");
    const user = usersList.getUser(socket);
    if (user && user.canJoinRoom()) {
      const room = rooms.getRoom(data.id);
      if (room && room instanceof GameRoom && room.joinable) {
        user.setRoom(room.name, room);
      }
    }
  });
  socket.on("ready:player", (data: boolean) => {
    console.log('[socket.ts]',"ready:player", data);
    const user = usersList.getUser(socket);
    if (user && user.room.room instanceof GameRoom) {
      user.game.ready = data;
      user.room.room.sendInfoGame();
    }
  });

  socket.on("message:user", (data: string) => {
    console.log('[socket.ts]',"message:user");
    const user = usersList.getUser(socket);
    try {
      if (user) {
        user.room.room?.emitToAll("message:room", {
          user: user.name,
          message: data,
        });
      }
    } catch (e) {
      console.log("error parsing message room", e);
    }
  });
  socket.on("create:user", (data): void => {
    console.log('[socket.ts]',"create:user");
    const token = socket.handshake.auth.token;
    try {
      const decoded: Decoded = verifyToken(token) as Decoded;

      if (decoded) {
        const user = usersList.getUserByKey(decoded.key);
        if (user) {
          user.name = data.username;
          usersList.initUser(user);
        } else {
          socket.emit("error", { message: "user not found" });
        }
      } else {
        socket.emit("error", { message: "token not found" });
      }
    } catch (e) {
      console.log(e);
      socket.emit("error", { message: "token not found" });
    }
  });

  socket.on("disconnect", (reason, details): void => {
    console.log("[disconnect]", "reason", reason);
    if (
      reason === "ping timeout" ||
      reason === "client namespace disconnect" ||
      reason === "transport close"
    ) {
      console.log("[disconnect]", "ping timeout", socket.id);
      const user = usersList.getUser(socket);
      if (user) timeOutListUser.add(user as Player);
    } else {
      console.log("[disconnect]", "disconnect", socket.id);
      usersList.removeUser(socket);
    }
  });
});
