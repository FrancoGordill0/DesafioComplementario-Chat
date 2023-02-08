import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import viewsRoute from "./routes/chat.router.js";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import { chatModel } from "./models/chat.model.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const STRING_CONNECTION = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.cmqpdge.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const app = express();
const messages = [];
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Ir al chat <a href='http://localhost:3000/views'>http://localhost:3000/views</a>");
});

app.use("/products", productRouter);
app.use("/carts", cartRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Aplicacion iniciada en http://localhost:${PORT}`);
  console.log("iniciado con socket.io");
});

const socketServer = new Server(httpServer);
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.static("public"));

app.post("/socketMessage", (req, res) => {
  const { message } = req.body;

  socketServer.emit("message", message);

  res.send("ok");
});

app.use("/views", viewsRoute);
app.get("/messages", (req, res) => {
  res.json(messages);
});

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado!");
  socket.on("new-user", (data) => {
    socket.user = data.user;
    socket.id = data.id;
    socketServer.emit("newUser-connected", {
      user: socket.user,
      id: socket.id,
    });
  });
  socket.on("message", (data) => {
    messages.push(data);
    socketServer.emit("messageLogs", messages);
    chatModel.create(data);
  });
});


const environment = async () => {
  await mongoose
    .connect(STRING_CONNECTION)
    .then(() => console.log("Conectado a la base de datos"))
    .catch((error) => console.log("Error de conexion", error));
};

environment();
