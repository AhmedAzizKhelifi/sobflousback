const io = require("socket.io")();

io.on("connect", (socket) => {
  io.on("hey", () => {
    console.log("test");
  });
});
io.on("hey", (data) => {
  console.log("data");
});

module.exports = io;
