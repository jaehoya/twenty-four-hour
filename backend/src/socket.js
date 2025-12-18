const socketIo = require("socket.io");

let io;

const init = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*", // 모든 도메인 허용 (보안 필요 시 수정)
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected", socket.id);

        socket.on("disconnect", () => {
            console.log("Client disconnected", socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { init, getIO };
