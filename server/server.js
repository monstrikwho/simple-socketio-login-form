require("dotenv").config({ path: "../.env" });

const app = require("express")();
const socket = require("socket.io");

const server = app.listen(process.env.PORT, () => {
  console.log("Server up on PORT: " + process.env.PORT);
});

const io = socket(server);

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  let lockedPass = null

  // We receive a login from a client
  socket.on("CHOOSE_UID_FROM_CLIENT", ({ uid }) => {
    const admins = [364984576, 727186107];
    
    if (admins.indexOf(+uid) !== -1) {
      lockedPass = 1111
      socket.emit("CHOOSE_UID_FROM_SERVER", { status: true });
    } else {
      socket.emit("CHOOSE_UID_FROM_SERVER", { status: false });
    }
  });

  socket.on("CHOOSE_PASS_FROM_CLIENT", ({ pass }) => {
    if (+pass === lockedPass) {
      socket.emit("CHOOSE_PASS_FROM_SERVER", { status: true });
    } else {
      socket.emit("CHOOSE_PASS_FROM_SERVER", { status: false });
    }
  });

});
