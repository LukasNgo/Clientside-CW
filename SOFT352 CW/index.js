var express = require("express");
var socket = require("socket.io");

var app = express();
var server = app.listen(8000, function(){
  console.log("listening on localhost:8000");
})

app.use(express.static("website"));

var io = socket(server);

io.on("connection", function(socket){
  console.log("made socket connection");

  socket.on("chat", function(data){
    io.sockets.emit("chat", data);
  });
});
