const blockSize = 20;
var socket = io.connect("http://localhost:8000");
var canvas = document.getElementById("playarea");
var context = canvas.getContext("2d");
var gamewidth = 600;
var gameheight = 600;
var posx = 40;
var posy = 40;
var lastposx = new Array();
var lastposy = new Array();
var horizontal = 0;
var vertical = 0;
var foodposx = Math.floor((Math.random() * ((gamewidth / blockSize) - 3)) + 2) * blockSize;
var foodposy = Math.floor((Math.random() * ((gameheight / blockSize) - 3)) + 2) * blockSize;
var varscore = 0;

//onload function that loads with the html page and sets the interval to call the main function
function window_OnLoad() {
  window.setInterval("main()", 120);
  document.getElementById("txtscore").value = 0;

  document.getElementById("restartbtn").addEventListener("click", function() {
    window.location.reload();
  });

  //test - set high score to 0
  //localStorage.setItem("highScore", 0);
}

//main function that repeats itself with a given interval set in window_OnLoad function
function main() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#cccccc";
  context.fillRect(0, 0, gamewidth, gameheight);
  food();
  grow();
  wall();
  levels();
  collisions();
  //document.getElementById("txthigh").value = localStorage.getItem("highScoreName") + " : " + localStorage.getItem("highScore");

  //MongoDB
  socket.on("scoresaved", function(data) {
    if (data.length) {
      document.getElementById("txthigh").innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        document.getElementById("txthigh").innerHTML += "<p>[Score: " + data[i].message + "] " + data[i].name + " (" + data[i].time + ")</p>";
      }
      //document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight - document.getElementById("output").clientHeight;
    }
  });
}

//detect collision with walls, food and the snake itself
function collisions() {
  for (i = 1, j = 101, k = 100; i < 101; i++, j--, k--) {
    lastposx[j] = lastposx[k];
    lastposy[j] = lastposy[k];
  }
  lastposx[1] = posx;
  lastposy[1] = posy;

  if (posx < blockSize || (posx + blockSize) > (gamewidth - blockSize) || posy < blockSize || (posy + blockSize) > (gameheight - blockSize)) {
    gameover();
  } else {
    posx = posx - horizontal;
    posy = posy - vertical;
  }

  if (foodposx == posx && foodposy == posy) {
    food();
    score();
  }

  if (varscore > 0) {
    for (i = 1; i < varscore; i++) {
      if (posx == lastposx[i] && posy == lastposy[i] && posx != blockSize * 2 && posy != blockSize * 2) {
        gameover();
      }
    }
  }

}

//change level when score reaches certain value
function levels() {
  if (varscore < 10) {
    document.getElementById("level").innerHTML = "Level 1"
  }

  if (varscore == 10) {
    document.getElementById("level").innerHTML = "Level 2"
    nextlevel();
  }

  if (varscore == 20) {
    document.getElementById("level").innerHTML = "Level 3"
    nextlevel();
  }

  if (varscore == 30) {
    document.getElementById("level").innerHTML = "Level 4"
    nextlevel();
  }

  if (varscore == 40) {
    document.getElementById("level").innerHTML = "Level 5"
    nextlevel();
  }

  if (varscore == 50) {
    document.getElementById("level").innerHTML = "Level 6"
    nextlevel();
  }

  if (varscore == 60) {
    document.getElementById("level").innerHTML = "Level 7"
    nextlevel();
  }
}

//draw snake food function by randomly drawing a square on canvas
function food() {
  var x = foodposx;
  var y = foodposy;

  for (i = 1; i < 100; i++) {
    if (foodposx == lastposx[i] && foodposy == lastposy[i]) {
      foodposx = Math.floor((Math.random() * ((gamewidth / blockSize) - 3)) + 2) * blockSize;
      foodposy = Math.floor((Math.random() * ((gameheight / blockSize) - 3)) + 2) * blockSize;
      //context.drawImage(food, x, y);
      context.fillStyle = "red";
      context.fillRect(x, y, blockSize, blockSize);
      context.fillStyle = "#333333";
      context.fillRect(x + 2, y + 2, blockSize - 4, blockSize - 4);
    } else {
      //context.drawImage(food, x, y);
      context.fillStyle = "red";
      context.fillRect(x, y, blockSize, blockSize);
      context.fillStyle = "#333333";
      context.fillRect(x + 2, y + 2, blockSize - 4, blockSize - 4);
    }
  }
}

//next level functions shrinks the play area by the size of 2 snake blocks
function nextlevel() {
  score();
  horizontal = 0;
  vertical = 0;
  posx = blockSize * 2;
  posy = blockSize * 2;
  for (i = 1; i < 100; i++) {
    lastposx[i] = 0;
    lastposy[i] = 0;
  }
  gamewidth = gamewidth - blockSize * 2;
  gameheight = gameheight - blockSize * 2;
  foodposx = Math.floor((Math.random() * ((gamewidth / blockSize) - 3)) + 2) * blockSize;
  foodposy = Math.floor((Math.random() * ((gameheight / blockSize) - 3)) + 2) * blockSize;
  food();
}

//draw the wall around the canvas
function wall() {
  for (var i = 0, j = 0; i < (gamewidth / blockSize), j < (gameheight / blockSize); i++, j++) {
    var x = i * blockSize;
    var y = j * blockSize;
    context.fillStyle = "#ffffff";
    context.fillRect(x, 0, blockSize, blockSize);
    context.fillRect(x, (gamewidth - blockSize), blockSize, blockSize);
    context.fillRect(0, y, blockSize, blockSize);
    context.fillRect((gameheight - blockSize), y, blockSize, blockSize);
    context.fillStyle = "#333333";
    context.fillRect(x + 1, 1, blockSize - 2, blockSize - 2);
    context.fillRect(x + 1, (gamewidth - blockSize + 1), blockSize - 2, blockSize - 2);
    context.fillRect(0 + 1, y + 1, blockSize - 2, blockSize - 2);
    context.fillRect((gameheight - blockSize + 1), y + 1, blockSize - 1, blockSize - 1);
  }
}

//controls arrow keys and WASD
function document_onKeyDown() {
  switch (window.event.keyCode) {
    case 37: //left
    case 65: //A
      if (horizontal == -blockSize) {
        horizontal = -blockSize;
        vertical = 0;
        break;
      } else {
        horizontal = +blockSize;
        vertical = 0;
        break;
      }

    case 38: //up
    case 87: //W
      if (vertical == -blockSize) {
        horizontal = 0;
        vertical = -blockSize;
        break;
      } else {
        horizontal = 0;
        vertical = +blockSize;
        break;
      }
    case 39: //right
    case 68: //D
      if (horizontal == +blockSize) {
        horizontal = +blockSize;
        vertical = 0;
        break;
      } else {
        horizontal = -blockSize;
        vertical = 0;
        break;
      }
    case 40: //down
    case 83: //S
      if (vertical == +blockSize) {
        horizontal = 0;
        vertical = +blockSize;
        break;
      } else {
        horizontal = 0;
        vertical = -blockSize;
        break;
      }
  }
}

//gameover and score handling function
function gameover() {
  horizontal = 0;
  vertical = 0;
  gamewidth = 600;
  gameheight = 600;

  var currentdate = new Date();

  //ask for name and save highest score to local storate
  //if (varscore > localStorage.getItem("highScore")) {
  //localStorage.setItem("highscore", varscore);
  var name = prompt("Please enter your name");
  if (name == null || name == "") {
    //localStorage.setItem("highScore", varscore);
    //localStorage.setItem("highScoreName", "Anonymous");

    //mongodb implementation
    socket.emit("score", {
      datetime: currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds(),
      message: varscore,
      handle: "Anonymous"
    });
    window.location.reload();
  } else {
    //localStorage.setItem("highScore", varscore);
    //localStorage.setItem("highScoreName", name);

    //MongoDB implementation
    socket.emit("score", {
      datetime: currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds(),
      message: varscore,
      handle: name
    });
    window.location.reload();
  }
  //}
  window.location.reload();


}

//update score
function score() {
  varscore = varscore + 1;
  document.getElementById("txtscore").innerHTML = "Your Score: " + varscore;
}

//grow the snake
function grow() {
  if (varscore == 0) {
    //draw snake head
    context.fillStyle = "#ffffff";
    context.fillRect(posx, posy, blockSize, blockSize);
    context.fillStyle = "#333333";
    context.fillRect(posx + 2, posy + 2, blockSize - 4, blockSize - 4);
  }

  for (var i = 1; i < varscore + 1; i++) {
    //draw snake head
    context.fillStyle = "#ffffff";
    context.fillRect(posx, posy, blockSize, blockSize);
    context.fillStyle = "#333333";
    context.fillRect(posx + 2, posy + 2, blockSize - 4, blockSize - 4);

    //draw snake body
    context.fillStyle = "#ffffff";
    context.fillRect(lastposx[i], lastposy[i], blockSize, blockSize);
    context.fillStyle = "#333333";
    context.fillRect(lastposx[i] + 2, lastposy + 2, blockSize - 4, blockSize - 4);
  }
}
