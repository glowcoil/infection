var width = 5;
var height = 5;

var board = [[]];

for (var y = 0; y < height; y++) {
  board[y] = [];
  for (var x = 0; x < width; x++) {
    board[y][x] = { state: "dead", color: "gray" };
  }
}

function step() {
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
}

function printBoard() {
  var str = "";
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      str += (+(board[y][x].state == "alive"))*2 + +(board[y][x].state == "dying"); str += " ";
    }
    str += "\n";
  }
  console.log(str);
}

board[0][0] = { state: "alive", color: "red" };
board[0][1].state = "alive";

printBoard();
for (var i = 0; i < 10; i++) {
  step();
  printBoard();
}