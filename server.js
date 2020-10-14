const express = require('express');
const socket = require('socket.io');

const app = express();
const port =  process.env.PORT || 8000;

let tasks = [];

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = socket(server);
io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
  socket.on('addTask', task => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', deleteTask => {
    tasks.filter(task => {
      return task.id !== deleteTask.id
    });
    socket.broadcast.emit('removeTask', deleteTask);
  });
});