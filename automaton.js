(function() {
  var canvas, context;
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

  printBoard = function() {
    var str = "";
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        str += (+(board[y][x].state == "alive"))*2 + +(board[y][x].state == "dying"); str += " ";
      }
      str += "\n";
    }
    alert(str);
  };

  window.onload = function() {
    canvas = document.getElementById("canvas");
    canvas.width = width * cellWidth;
    canvas.height = height * cellHeight;
    context = canvas.getContext("2d");
    setInterval(function() { update() }, 1000 * document.getElementById("delay").value);
    draw();
  };
})();