
const tiles = {
    WALL: 0,
    FLOOR: 1,
    START: 2,
    END: 3
}


function mazeFromSeed(initSeed, length, width){
  var rng = new Math.seedrandom(initSeed);
  console.log(rng());
  var mazeTiles = new Array(length).fill(tiles.WALL);
  console.log("length:" + length);
  for(var i = 0; i < length; i++){
    mazeTiles[i] = new Array(width).fill(tiles.WALL);
    console.log(i);
  }
  mazeTiles[0][0] = tiles.START;
  mazeTiles[length - 1][width - 1] = tiles.END;

  var valid = 0;
  while(valid < 10000){
    var seedLength = Math.floor(rng() * length % length);
    //console.log("length:" + seedLength);
    var seedWidth = Math.floor(rng() * width % width);
    var accept = false;
    var reject = false;
    startLoop = mazeTiles[seedLength][seedWidth];

    if(checkNeighbors(mazeTiles, length, width, seedLength, seedWidth)){
      console.log("rejecting as maze is adjacent");
      reject = true;
    }

    var loopTiles = new Array(length).fill(tiles.WALL);
    for(var i = 0; i < length; i++){
      loopTiles[i] = new Array(width).fill(tiles.WALL);
    }


    var direction = Math.floor(rng() * 4);
    while(!accept && !reject){
      //move to a new random tile, reject if it hits an edge
      console.log("Direction: " + direction);
      console.log("Initial X: " + seedLength + "Y: " + seedWidth);
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


      console.log("Post X: " + seedLength + "Y: " + seedWidth);
      //loop is encountering itself
      //checkneighbors must be greater than 1 to ignore previous tile
      if((loopTiles[seedLength][seedWidth] == tiles.FLOOR) || (checkNeighbors(loopTiles, length, width, seedLength, seedWidth) > 1)){
        console.log("met loop");
        reject = true;
      }


      loopTiles[seedLength][seedWidth] = tiles.FLOOR;
      //get new random direction
      direction = Math.floor(rng() * 4);
      if(reject == false && checkNeighbors(mazeTiles, length, width, seedLength, seedWidth)){
      //if it meets the maze, accept
        accept = true;
        console.log("met maze");
        loopTiles[0][0] = tiles.WALL;
        loopTiles[length - 1][width - 1] = tiles.WALL;
      }
    }

      if(accept){
      for(var i = 0; i < length; i++){
        for(var j = 0; j < width; j++){
          if(mazeTiles[i][j] == tiles.WALL && loopTiles[i][j] == tiles.FLOOR){
                  console.log("Accepting:" + i + ", " + j);
            mazeTiles[i][j] = tiles.FLOOR;
          }
        }
      }
    }
          valid++;
  }
console.log(Math.floor(rng() * 4));
console.log(Math.floor(rng() * 4));
console.log(Math.floor(rng() * 4));
console.log(Math.floor(rng() * 4));
return mazeTiles;
}

function checkNeighbors(arr, maxLength, maxWidth, length, width){
  var tile_total = 0
  if(length < maxLength - 1){
     tile_total += arr[length + 1][width];
  }
  if(length > 0){
     tile_total += arr[length - 1][width];
  }
  if(width < maxWidth - 1){
     tile_total += arr[length][width + 1];
  }
  if(width > 0){
     tile_total += arr[length][width - 1];
  }
  if(tile_total > 0){
    return true;
  }
  return false;
}


function loadMaze(seed, difficulty){
  var mazeArray = mazeFromSeed(seed, 8, 8);
  console.table(mazeArray);
  var mazeContainer = document.getElementById("mazeContainer");
  for(var i = 0; i < 8; i++){
    var row = mazeContainer.insertRow(i);
    for(var j = 0; j < 8; j++){
      var cell = row.insertCell(j);
      cell.innerHTML = mazeArray[i][j];
    }
  }
}
loadMaze("tet", "hard");
