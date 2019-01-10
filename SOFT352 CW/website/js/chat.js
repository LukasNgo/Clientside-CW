//connect socket to localhost and get message and handle elements from html
var socket = io.connect("http://localhost:8000");
var message = document.getElementById("message");
var handle = document.getElementById("handle");

//add click event to the button and send message and handle values on click
document.getElementById("send").addEventListener("click", function() {
  if (handle.value == "" || message.value == "") {
    document.getElementById("output").innerHTML = "<p>enter your name and message</p>" + document.getElementById("output").innerHTML;
    //document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight - document.getElementById("output").clientHeight;
  } else {
    var currentdate = new Date();

    //clicking the button emits current date, name of the person sending the message and the message itself and sends it to the server which saves it into MongoDB database
    socket.emit("chat", {
      datetime: currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds(),
      message: message.value,
      handle: handle.value
    });
    document.getElementById("message").value = null;
  }
});

//when the client receives a socket data called chatsaved it knows it contains an array of chats from the database and displays it in the chat window
socket.on("chatsaved", function(data) {
  if (data.length) {
    document.getElementById("output").innerHTML = "";
    for (var i = 0; i < data.length; i++) {
      document.getElementById("output").innerHTML += "<p>[" + data[i].time + "] " + data[i].name + " : " + data[i].message + "</p>";
    }
    //document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight - document.getElementById("output").clientHeight;
  }
});

//when receiving data from the socket add it to the html and scroll the window to the bottom(revised)
socket.on("chat", function(data) {
  document.getElementById("output").innerHTML = "<p>[" + data.datetime + "] " + data.handle + " : " + data.message + "</p>" + document.getElementById("output").innerHTML;
  //document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight - document.getElementById("output").clientHeight;
});
