(function() {
  var canvas, context, canvasX, canvasY;
  var width = 20;
  var height = 20;
  var cellWidth = 32;
  var cellHeight = 32;

  var board = [[]];

  for (var y = 0; y < height; y++) {
    board[y] = [];
    for (var x = 0; x < width; x++) {
      board[y][x] = { state: "dead", color: "gray" };
    }
  }

  step = function() {
    var buffer = board.slice().map(function(row) { return row.slice(); });
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        switch (board[y][x].state) {
          case "alive":
            buffer[y][x] = { state: "dying", color: board[y][x].color };
          break;
          case "dying":
            buffer[y][x] = { state: "dead", color: "gray" };
          break;
          case "dead":
            var neighbors = [];
            for (var neighborY = y - 1; neighborY <= y + 1; neighborY++) {
              if (neighborY >= 0 && neighborY < board.length) {
                for (var neighborX = x - 1; neighborX <= x + 1; neighborX++) {
                  if ( !(neighborX == x && neighborY == y) && neighborX >= 0 && neighborX < board[neighborY].length) {
                    if (board[neighborY][neighborX].state == "alive") {
                      neighbors.push(board[neighborY][neighborX]);
                    }
                  }
                }
              }
            }
            if (neighbors.length == 2) {
              buffer[y][x] = { state: "alive", color: "gray" };
              if (neighbors[0].color == neighbors[1].color) {
                buffer[y][x].color = neighbors[0].color;
              }
            }
          break;
        }
      }
    }
    board = buffer;
  };

  board[0][10] = { state: "alive", color: "blue" };
  board[0][11] = { state: "alive", color: "blue" };
  board[11][10] = { state: "alive", color: "red" };
  board[11][11] = { state: "alive", color: "red" };
  board[12][10] = { state: "dying", color: "red" };
  board[12][11] = { state: "dying", color: "red" };

  update = function() {
    step();
    draw();
  };
  
  draw = function() {
    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        var fillStyle;
        switch (board[y][x].color) {
          case "red":  fillStyle = "rgba(255, 0, 0, ";     break;
          case "blue": fillStyle = "rgba(0, 0, 255, ";     break;
          case "gray": fillStyle = "rgba(255, 255, 255, "; break;
        }
        switch (board[y][x].state) {
          case "alive": fillStyle += "1)"; break;
          case "dying": fillStyle += "0.75)"; break;
          case "dead":  fillStyle += "0)"; break;
        }
        context.fillStyle = fillStyle;
        context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
  }
  
  function onmousemove(event) {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var currentElement = canvas;
    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    } while (currentElement = currentElement.offsetParent)
    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;
    
  }
  function onclick() {
    board[Math.floor(canvasY / cellHeight)][Math.floor(canvasX / cellWidth)] = getPaintBrush();
    draw();
  }
  
  function getPaintBrush() {
    var color;
    var colors = document.getElementsByName("color");    
    for (i = 0; i < colors.length; i++) {      
      if (colors[i].checked) {
        color = colors[i].value;        
      }
    }
    return { state: "alive", color: color };
  }

  window.onload = function() {
    canvas = document.getElementById("canvas");
    canvas.width = width * cellWidth;
    canvas.height = height * cellHeight;
    context = canvas.getContext("2d");
    
    var updateIntervalId = setInterval(function() { update() }, 1000 * document.getElementById("delay").value);
    var running = true;
    var button = document.getElementById("pause");
    button.addEventListener("click", function() {
      running = !running;
      if (running) {
        updateIntervalId = setInterval(function() { update() }, 1000 * document.getElementById("delay").value);
        button.value = "stop";
      } else {
        clearInterval(updateIntervalId);
        button.value = "start";
      }
    }, false);
    
    var onclickIntervalId;
    canvas.addEventListener("mousedown", function(event) {
      onclickIntervalId = setInterval(onclick, 10);
    }, false);
    document.addEventListener("mouseup", function() {
      clearInterval(onclickIntervalId);
    }, false);
    canvas.addEventListener("mousemove", onmousemove, false);
    draw();
  };
})();