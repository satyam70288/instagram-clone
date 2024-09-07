const userSocketMap = {}; // This map stores socket id corresponding to the user id; userId -> socketId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

export const initializeSocketIO = (io) => {
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap[userId] = socket.id;
        }
        console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);
        io.emit("welcome","welcome to the server")
        io.emit('getOnlineUsers', Object.keys(userSocketMap));

        socket.on('disconnect', () => {
            if (userId) {
                delete userSocketMap[userId];
            }
            // io.emit('getOnlineUsers', Object.keys(userSocketMap));
            // console.log(`User disconnected: ${userId}, Socket ID: ${socket.id}`);
        });
    });
};
