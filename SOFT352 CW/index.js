var express = require("express");
var socket = require("socket.io");
var mongo = require("mongodb").MongoClient;

var app = express();
var server = app.listen(8000, function(){
  console.log("listening on localhost:8000");
})

app.use(express.static("website"));

var io = socket(server);

io.on("connection", function(socket){
  console.log("made socket connection");

  mongo.connect("mongodb://localhost/", function(err, client){
    if (err) {
      throw err;
    }
    console.log("made MongoDB connection");

    var db = client.db("chatdb");

    //get messages from database
    db.collection("chatdb").find().limit(50).sort({_id:1}).toArray(function(err, result){
      if (err) {
        throw err;
      }
      io.sockets.emit("chatsaved", result);
    });

    socket.on("chat", function(data){
      io.sockets.emit("chat", data);
      db.collection("chatdb").insertOne({time:data.datetime, name: data.handle, message: data.message});
    });


  });


});











//
//     io.on("connection", function(socket){
//       console.log("made socket connection");
//
//       socket.on("chat", function(data){
//         chat.insert({name: data.handle, message: data.message}, function(){
//           io.sockets.emit("chat", data);
//         });
//       });
//     });
//   });
// });
