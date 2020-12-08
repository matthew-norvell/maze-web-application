//constants representing each tile as an integer
const tiles = {
    WALL: 0,
    FLOOR: 1,
    START: 2,
    END: 3
}

const difficulty = {
  "EASY": [10, 10],
  "MEDIUM": [20, 20],
  "HARD": [40, 40]
}

const sprites = {
  0: "wall.png",
  1: "floor.png",
  2: "start.png",
  3: "end.png"
}

function mazeFromSeed(initSeed, diff){
  //create new number generator object
  var rng = new Math.seedrandom(initSeed);
  var length = difficulty[diff][0];
  var width = difficulty[diff][1];
  //create 2d array to represent maze tiles
  var mazeTiles = new Array(length).fill(tiles.WALL);
  for(var i = 0; i < length; i++){
    mazeTiles[i] = new Array(width).fill(tiles.WALL);
  }

  //initialize maze start for loop to build from
  mazeTiles[0][0] = tiles.FLOOR;

  //valid counts the number of maze iterations
  //TODO: implement a way to check when the maze is complete instead
  var valid = true;
  while(valid){

    valid = false

    //generate a locaiton for a new loop
    var seedLength = Math.floor(rng() * length % length);
    var seedWidth = Math.floor(rng() * width % width);


    //initialize reject variable
    var reject = false;

    //rejects the loop if a maze is adjacent, eliminating two-wide hallways < 100000
    if(checkNeighbors(mazeTiles, seedLength, seedWidth)){
      reject = true;
    }

    //create a 2d array to store the current loop
    var loopTiles = new Array(length).fill(tiles.WALL);
    for(var i = 0; i < length; i++){
      loopTiles[i] = new Array(width).fill(tiles.WALL);
    }


    while(!reject){
      //generate a new direction and move to a new tile
      var direction = Math.floor(rng() * 4);
      switch(direction){
        case 0:
          if(seedWidth + 1 < width){
            seedWidth = seedWidth + 1;
          } else {
            reject = true;
          }
          break;
        case 1:
          if(seedWidth > 0){
            seedWidth = seedWidth - 1;
          } else {
            reject = true;
          }
          break;
        case 2:
          if(seedLength + 1 < length){
            seedLength = seedLength + 1;
          } else {
            reject = true;
          }
          break;
        case 3:
          if(seedLength > 0){
            seedLength = seedLength - 1;
          } else {
            reject = true;
          }
          break;
        default:
          reject = true;
      }

      //loop is encountering itself
      //checkneighbors must be greater than 1 to ignore previous tile
      if((loopTiles[seedLength][seedWidth] == tiles.FLOOR) || (checkNeighbors(loopTiles, seedLength, seedWidth) > 1) || checkNeighbors(mazeTiles, seedLength, seedWidth) > 1){
        break;
      } else if(reject) {
        continue;
      } else {
        //if loop hasnt encountered itself, add tile to loop
        loopTiles[seedLength][seedWidth] = tiles.FLOOR;
      }

      //if loop meets the maze, accept
      if(checkNeighbors(mazeTiles, seedLength, seedWidth)){
        //sets these tiles to walls to not interfere with the start and end tiles of the maze
        loopTiles[0][0] = tiles.WALL;
        loopTiles[length - 1][width - 1] = tiles.WALL;

        //add loop tiles to maze
        for(var i = 0; i < length; i++){
          for(var j = 0; j < width; j++){
            if(mazeTiles[i][j] == tiles.WALL && loopTiles[i][j] == tiles.FLOOR){
              mazeTiles[i][j] = tiles.FLOOR;
            }
          }
        }
        reject = true;
      }
    }

    //checks to see if maze generation is complete
    var i = 1;
    while(i < length - 1 && !valid){
      var j = 1;
      while(j < width - 1 && !valid){
        if(checkNeighbors(mazeTiles, i, j) < 1){
          var diagonal_tiles = 0;
          diagonal_tiles += mazeTiles[i + 1][j + 1];
          diagonal_tiles += mazeTiles[i + 1][j - 1];
          diagonal_tiles += mazeTiles[i - 1][j + 1];
          diagonal_tiles += mazeTiles[i - 1][j - 1];
          if(diagonal_tiles < 1){
            valid = true;
          }
        }
        j++;
      }
      i++;
    }
  }
mazeTiles[0][0] = tiles.START;

var endLength = length - 1;
var endWidth = width - 1;
var i = 0;
while(mazeTiles[endLength][endWidth] != tiles.END){
  var j = 0;
  while(j <= i){
    if(checkNeighbors(mazeTiles, endLength - i, endLength - j) == 1){
      endLength -= i;
      endWidth -= j;
      mazeTiles[endLength][endWidth] = tiles.END;
      break;
    }
    j++;
  }
  i++;
}
//mazeTiles[length - 1][width - 1] = tiles.END;
return mazeTiles;
}

//takes a 2d array an a pair of coordinates and returns the number of adjacent tiles
function checkNeighbors(arr, length, width){
  var tile_total = 0
  if(length < arr.length - 1){
     tile_total += arr[length + 1][width];
  }
  if(length > 0){
     tile_total += arr[length - 1][width];
  }
  if(width < (arr[0].length - 1)){
     tile_total += arr[length][width + 1];
  }
  if(width > 0){
     tile_total += arr[length][width - 1];
  }
    return tile_total;
}

//takes a seed and difficulty and displays it in the table with id "mazeContainer"
function loadMaze(maze){
  var mazeContainer = document.getElementById("mazeContainer");
  mazeContainer.innerHTML = "";
  for(var i = 0; i < maze.length; i++){
    var row = mazeContainer.insertRow(i);
    for(var j = 0; j < maze[0].length; j++){
      var cell = row.insertCell(j);
      cell.innerHTML = "<img src='./" + sprites[maze[i][j]] + "'>";
    }
  }
}
loadMaze(mazeFromSeed("test", "HARD"));
