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
  "HARD": [30, 30]
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
  var valid = 0;
  while(valid < 10000){

    //generate a locaiton for a new loop
    var seedLength = Math.floor(rng() * length % length);
    var seedWidth = Math.floor(rng() * width % width);


    //initialize accept or reject variables
    var reject = false;

    //rejects the loop if a maze is adjacent, eliminating two-wide hallways
    if(checkNeighbors(mazeTiles, seedLength, seedWidth)){
      console.log("rejecting as maze is adjacent");
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
          console.log("DEFAULT");
      }

      console.log("loop is at: " + seedLength.toString() + ", " + seedWidth.toString())
      //loop is encountering itself
      //checkneighbors must be greater than 1 to ignore previous tile
      if((loopTiles[seedLength][seedWidth] == tiles.FLOOR) || (checkNeighbors(loopTiles, seedLength, seedWidth) > 1) || checkNeighbors(mazeTiles, seedLength, seedWidth) > 1){
        console.log("loop is encountering itself")
        break;
      } else if(reject) {
        console.log("loop has hit a wall")
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
              console.log("Accepting:" + i.toString() + ", " + j.toString());
              mazeTiles[i][j] = tiles.FLOOR;
            }
          }
        }
        break;
      }
    }
    valid++;
  }
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
  console.table(maze);
  var mazeContainer = document.getElementById("mazeContainer");
  for(var i = 0; i < maze.length; i++){
    var row = mazeContainer.insertRow(i);
    for(var j = 0; j < maze[0].length; j++){
      var cell = row.insertCell(j);
      cell.innerHTML = maze[i][j];
      //cell.innerHTML = "<img src='./" + sprite + "'>";
    }
  }
}
loadMaze(mazeFromSeed("test", "EASY"));
