const jwt = require('jsonwebtoken');

let io;

const initializeSocketEvents = (socketIo) => {
  io = socketIo;

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connecté:', socket.user.username);

    socket.on('disconnect', () => {
      console.log('Client déconnecté:', socket.user.username);
    });
  });
};

const emitTaskCreated = (task) => {
  if (io) {
    io.emit('taskCreated', task);
  }
};

const emitTaskUpdated = (task) => {
  if (io) {
    io.emit('taskUpdated', task);
  }
};

const emitTaskDeleted = (taskId) => {
  if (io) {
    io.emit('taskDeleted', taskId);
  }
};

module.exports = {
  initializeSocketEvents,
  emitTaskCreated,
  emitTaskUpdated,
  emitTaskDeleted
}; 