//connect socket to localhost and get message and handle elements from html
var socket = io.connect("http://localhost:8000");
var message = document.getElementById("message");
var handle = document.getElementById("handle");

//add click event to the button and send message and handle values on click
document.getElementById("send").addEventListener("click", function() {
  socket.emit("chat", {
    message:message.value,
    handle:handle.value
  });
});

//when receiving data from the socket add it to the html and scroll the window to the bottom
socket.on("chat", function(data){
  var currentdate = new Date();
  var datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":"  + currentdate.getMinutes() + ":"  + currentdate.getSeconds();
  document.getElementById("output").innerHTML += "<p>[ " + datetime + "] " + data.handle + " : " + data.message + "</p>";
  document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight - document.getElementById("output").clientHeight;
});
