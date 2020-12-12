//constants representing each tile as an integer
const tiles = {
    WALL: 0,
    FLOOR: 1,
    START: 2,
    END: 3,
    PLAYER: 4
}

//constants representing each difficulty by its maze size
const difficulty = {
  "EASY": [20, 20],
  "MEDIUM": [40, 40],
  "HARD": [60, 40]
}

//constants that loadSprites() fills with loaded images corresponding to tiles
const sprites = {
  0: "wall.png",
  1: "floor.png",
  2: "start.png",
  3: "end.png",
  4: "player.png"
}

//maze singleton to be accessed by all other functions
var maze = null;

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

  //maze checks istelf every loop to see if it can still generate new tiles
  var valid = true;
  while(valid){

    //generate a locaiton for a new loop
    var seedLength = Math.floor(rng() * length % length);
    var seedWidth = Math.floor(rng() * width % width);

    //initialize reject variable
    var reject = false;

    //rejects the loop if a maze is adjacent, eliminating two-wide hallways
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
    valid = false;
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

//searches for the nearest floor tile and places an exit next to it
var endLength = length - 1;
var endWidth = width - 1;
var i = 0;
while(mazeTiles[endLength][endWidth] != tiles.END){
  var j = 0;
  while(j <= i){
    if(checkNeighbors(mazeTiles, endLength - i, endWidth - j) == 1){
      endLength -= i;
      endWidth -= j;
      mazeTiles[endLength][endWidth] = tiles.END;
      break;
    }
    j++;
  }
  i++;
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

//takes a seed and difficulty and displays it in the canvas with id "mazeCanvas"
function loadMaze(){
  var scale = 16
  var mazeCanvas = document.getElementById("mazeCanvas");
  mazeCanvas.height = (maze[0].length + 2) * scale;
  mazeCanvas.width = (maze.length + 2) * scale;
  var mazeContext = mazeCanvas.getContext("2d");
  for(var i = 0; i < maze.length; i++) {
    for(var j = 0; j < maze[0].length; j++){
      mazeContext.drawImage(sprites[maze[i][j]], scale*(i + 1), scale*(j + 1));
    }
  }
  for(var i = 0; i < maze.length + 2; i++){
    mazeContext.drawImage(sprites[tiles.WALL], scale*i, 0);
    mazeContext.drawImage(sprites[tiles.WALL], scale*i, scale*(maze[0].length + 1));
  }
  for(var j = 0; j < maze[0].length + 2; j++){
    mazeContext.drawImage(sprites[tiles.WALL], 0, scale*j);
    mazeContext.drawImage(sprites[tiles.WALL], scale*(maze.length + 1), scale*j);
  }
}

//loads the sprites for use in displaying the maze
function loadSprites(){
  for(var i = 0; i <= 4; i++){
    var img = new Image();
    img.src = sprites[i];
    sprites[i] = img;
  }
}

//initiate the maze generation and display when the page loads
function mazeInit(){
  var diff = sessionStorage.difficulty;
  if(difficulty.hasOwnProperty(diff)){
    var seed = Math.random();
    sessionStorage.seed = seed;
    maze = mazeFromSeed(seed, diff);
    loadMaze();
  } else {
    var canvas = document.getElementById("mazeCanvas");
    canvas.height = 200;
    canvas.width = 600;
    var context = mazeCanvas.getContext("2d");
    context.font = "30px Arial";
    context.fillText("Invalid difficulty! Please select difficulty", 10, 50);
    context.fillText("from the difficulty select page.", 10, 100);
  }
}

function mazeInProgress(){
  start();
  var x = 0;
  var y = 0;
  drawTile(x, y, tiles.PLAYER);
  console.log("in progress");
  window.addEventListener("keydown", function inputHandler(event) {

  drawTile(x, y, maze[x][y]);
  switch (event.key) {
    case "ArrowDown":
      if(y + 1 < maze[0].length && maze[x][y + 1] != tiles.WALL){
        y += 1;
      }
      break;
    case "ArrowUp":
      if(y > 0 && maze[x][y - 1] != tiles.WALL){
        y -= 1;
      }
      break;
    case "ArrowLeft":
      if(x > 0 && maze[x - 1][y] != tiles.WALL){
        x -= 1;
      }
      break;
    case "ArrowRight":
      if(x + 1< maze.length && maze[x + 1][y] != tiles.WALL){
        x += 1;
      }
      break;
    default:
  }

  drawTile(x, y, tiles.PLAYER);

  if(maze[x][y] == tiles.END){
    console.log("END");
    window.removeEventListener("keydown", inputHandler, true);
    stop();
  }

  event.preventDefault();
  }, true);
}

function drawTile(x, y, tileID){
  var scale = 16
  var mazeCanvas = document.getElementById("mazeCanvas");
  var mazeContext = mazeCanvas.getContext("2d");
  mazeContext.drawImage(sprites[tileID], scale*(x + 1), scale*(y + 1));
}

loadSprites();
