var express = require("express");
var socket = require("socket.io");
var mongo = require("mongodb").MongoClient;

var app = express();
var server = app.listen(8000, function() {
  console.log("listening on localhost:8000");
})

app.use(express.static("website"));

var io = socket(server);

io.on("connection", function(socket) {
  console.log("made socket connection");

  mongo.connect("mongodb://localhost/", function(err, client) {
    if (err) {
      throw err;
    }
    console.log("made MongoDB connection");

    var db = client.db("chatdb");
    var scoredb = client.db("snakedb");

    //get messages from database and sort by id
    db.collection("chatdb").find().limit(50).sort({
      _id: 1
    }).toArray(function(err, result) {
      if (err) {
        throw err;
      }
      io.sockets.emit("chatsaved", result);
    });

    socket.on("chat", function(data) {
      io.sockets.emit("chat", data);
      db.collection("chatdb").insertOne({
        time: data.datetime,
        name: data.handle,
        message: data.message
      });
    });

    //get high scores for snake Minigames and sort by highest score
    scoredb.collection("snakedb").find().limit(50).sort({
      message: -1
    }).toArray(function(err, result) {
      if (err) {
        throw err;
      }
      io.sockets.emit("scoresaved", result);
    });

    socket.on("score", function(data) {
      io.sockets.emit("score", data);
      scoredb.collection("snakedb").insertOne({
        time: data.datetime,
        name: data.handle,
        message: data.message
      });
    });
  });
});
