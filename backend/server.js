import express from "express"
import {createServer} from "http"
import { Server } from "socket.io"

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {origin: "*"}
});

io.on('connection', (socket) => {
    console.log("a user connected");
    io.on('new-offer', (msg) => {
        if (msg.offer) {
            console.log(msg.offer);
        }
    })
})

server.listen(3000, () => {
    console.log("listening on http://localhost:3000");
})