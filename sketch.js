//settings:
let gravity = .08;
let mouse_sens = 2;
let target_fps = 60;
let chunk_size;
let world_size;
let walking_speed = .05;
let sprinting_speed = .07;

//no changing
let running = false;
let delta = 0.0;
let sprint = false;
let textures = [];
let mouse_captured = false;
let block_selected = false;


//chunk cordinates the player is in
let chunkCords = cvec(0,0);

//cordinates of the block the player is facing
let blockCords = cvec(0,0,0);

//cordinates of the block the player is facing, relative to the current chunk
let relativeBlockCords = cvec(0,0,0);

//chunk cordinates of the block the player is facing
let chunkBlockCords = cvec(0,0,0);

//cords of where the raycast intercepts the selected block
let blockCordsIntercept = cvec(0,0,0);







let fps = 0;
p5.disableFriendlyErrors = true; //performance
var rover;
let height_to_be;
let chat_open = false;




//movement
let jump = false;

async function setup_() {
  const startTime = performance.now();
  document.querySelector("#hud").style.display = "flex"
  noiseSeed(1);
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL); 
  loadBlockTextures(canvas);


  

  translate(0,0,0);
  //textureMode(NORMAL);

  frameRate(target_fps);

  noStroke(); // kein drahtgitter

  chunks = new Array(world_size);

  for (let i = 0; i < world_size; i++) {
    chunks[i] = new Array(world_size);
  }

  
  document.getElementById("loading_bar").style.width = "10vmin";

  rover = createRoverCam();
  rover.usePointerLock();    // optional; default is keyboard control only
  rover.setState({           // optional
    active: true,
    enableControl: true,
    position: [0,0,0],
    rotation: [0,0,0],
    offset: [0,0],
    fov: 2,
    speed: walking_speed,
    sensitivity: 0.05
  });

  let generated_chunks = 0;
  let chunks_to_generate = world_size * world_size;
  for (let x = 0; x < world_size; x++) {
  for (let y = 0; y < world_size; y++) {
    chunks[x][y] = new Chunk(x*chunk_size, 0, y*chunk_size, generated_chunks);
    generated_chunks++;
    document.getElementById("loading_bar").style.width = generated_chunks / chunks_to_generate * 85 + "vmin";
    document.getElementById("loading_info").innerHTML = "generating chunk:" + generated_chunks + "/" + chunks_to_generate + "<br>";
    await sleep(1);
  }}
  document.getElementById("loading_info").innerHTML = "culling...";
  const endTime = performance.now();
  printCln(`Generation took <span style="color: lime;">${endTime - startTime}</span> milliseconds.`);
  setInterval(function(){fps = frameRate();}, 100)
  running = true;


  
}

function draw() {
  if(running){
    //calculate all cordinates
      
    chunkCords.x = Math.floor((round(rover.position.x))/chunk_size);    
    chunkCords.y = Math.floor((round(rover.position.y))/chunk_size);
    if(chunkCords.x > world_size || chunkCords.x < 0){chunkCords.x=0;}
    if(chunkCords.y > world_size || chunkCords.y < 0){chunkCords.y=0;}







    delta = deltaTime/(1000/20);
    if (sprint){
      rover.speed = sprinting_speed;
    }else{
      rover.speed = walking_speed;
    }

    
    
    background("#78A7FF"); // sky

    let c = color(255, 0, 0);
    lights();

    translate(0,0,0);

    //render chunks
    for (let x = 0; x < world_size; x++) {
    for (let y = 0; y < world_size; y++) {
      chunks[x][y].render();
      chunks[x][y].renderChunkBorders();
      
    }}



    


    //height_to_be = chunks[chunkCords.x][chunkCords.z].collision_map[round(rover.position.x)-chunkCords.x*chunk_size][round(rover.position.z)-chunkCords.z*chunk_size] -2;

    for (let i = round(rover.position.z); i < chunk_size; i++) {//height to be
      let blocktype = chunks[chunkCords.x][chunkCords.y].blocks[round(relativeBlockCords.x)][i][round(relativeBlockCords.y)].type
      if(blocktype != BlockTypes.AIR){
        height_to_be = i - 2;
        break;
      }
    }

    //gravity
    if(rover.position.z < height_to_be + 0.001 && rover.position.z > height_to_be - 0.001){
      rover.position.z = height_to_be;
    }
    else{
      if(rover.position.z < height_to_be){
        rover.velocity.z += gravity * delta;
      }else{
        rover.velocity.z = 0;
      }
      if(rover.position.z > height_to_be){
        rover.position.z = height_to_be;
      }
    }


  
    


    


    for (let i = 0.0; i < 5; i+=0.001) { //find the selected block
      let distance = i; // Distance from the camera
      blockCordsIntercept.x = rover.position.x + cos(rover.pan) * cos(rover.tilt) * distance;
      blockCordsIntercept.y = rover.position.y + sin(rover.pan) * cos(rover.tilt) * distance;
      blockCordsIntercept.z = rover.position.z + sin(rover.tilt) * distance;

      //snap to blocks
      blockCords.x = round(blockCordsIntercept.x);
      blockCords.y = round(blockCordsIntercept.y);
      blockCords.z = round(blockCordsIntercept.z);


      chunkBlockCords.x = Math.floor((round(blockCords.x))/chunk_size);    
      chunkBlockCords.y = Math.floor((round(blockCords.y))/chunk_size);

      //relative to chunk
      relativeBlockCords.x = blockCords.x-chunkBlockCords.x*chunk_size;
      relativeBlockCords.y = blockCords.y-chunkBlockCords.y*chunk_size;



      if (chunkBlockCords.x > world_size || chunkBlockCords.y > world_size || chunkBlockCords.x < 0 || chunkBlockCords.y < 0 || blockCords.z > chunk_size || blockCords.y < 0){
        return
      }else{
        //if it cant find a block after distance five there will be none 
        if(i == 5 && chunks[chunkBlockCords.x][chunkBlockCords.y].blocks[relativeBlockCords.x][blockCords.y][blockCords.z_relative].type == BlockTypes.AIR){
          block_selected = false;
        }

        //check if block is not air and if it is not air it will be the selected block
        if(chunks[chunkBlockCords.x][chunkBlockCords.y].blocks[relativeBlockCords.x][blockCords.y][blockCords.z_relative].type != BlockTypes.AIR){
          block_selected = true;
          break;
        }else{
          block_selected = false;
        }
      }
    }

    if(block_selected){
      draw_block_selector(blockCords.x,blockCords.y,blockCords.z,color(0,0,0,0),color(0,0,0,255),0.01);
    }





    document.getElementById("topleft_info").innerHTML = `
    ${Math.round(fps)} FPS Frametime: ${deltaTime}<br>
    delta: ${delta}<br>
    X: ${round(rover.position.x)} Y: ${round(rover.position.y)} Z: ${round(rover.position.z)}<br>
    Chunk X: ${chunkCords.x} Y: ${chunkCords.y}<br>    
    Vel X: ${round(rover.velocity.x)} Y: ${round(rover.velocity.y)} Z: ${round(rover.velocity.z)}<br>
    Block: X:${blockCords.x} Y:${blockCords.y} Z:${blockCords.z}<br>
    heightTB: ${round(height_to_be)} posY: ${round(rover.position.y)} block_xplus: ${round(block_xplus)}`;
  }
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cam.perspective(2, width / height, 0.1, 1000);
} 



function keyPressed(){
  print(keyCode);
  if(keyCode == 32){
    jump = true;
    rover.velocity.z = -.5
  }
  if(keyCode == 17){
    sprint = true;
  }
}

function keyReleased(){
  //print(keyCode);
  if(keyCode == 32){
    jump = false;
  }
  if(keyCode == 17){
    sprint = false;
  }
}

function mousePressed(){
  if(mouseButton == RIGHT){
    if(running){
      let blockPlaceLocation = cvec(0,0,0);
      let distance_temp = 10.0;
      let side_temp = "idk"

      if(cvec(blockCordsIntercept.x,blockCordsIntercept.y,blockCordsIntercept.z).dist(cvec(blockCords.x+1,blockCords.y,blockCords.z)) < distance_temp){
        distance_temp = cvec(blockCordsIntercept.x,blockCordsIntercept.y,blockCordsIntercept.z).dist(cvec(blockCords.x+1,blockCords.y,blockCords.z));
        side_temp = "x+1"
        blockPlaceLocation = cvec(blockCords.x+1,blockCords.y,blockCords.z);// copy to everyone
      }
      
      if(cvec(blockCordsIntercept.x,blockCordsIntercept.y,blockCordsIntercept.z).dist(cvec(blockCords.x-1,blockCords.y,blockCords.z)) < distance_temp){
        distance_temp = cvec(blockCordsIntercept.x,blockCordsIntercept.y,blockCordsIntercept.z).dist(cvec(blockCords.x-1,blockCords.y,blockCords.z));
        side_temp = "x-1"
        blockPlaceLocation = cvec(blockCords.x-1,blockCords.y,blockCords.z);
      }
      
      if(cvec(blockCordsIntercept.x,blockCordsIntercept.y,blockCordsIntercept.z).dist(cvec(blockCords.x,blockCords.y+1,blockCords.z)) < distance_temp){
        distance_temp = cvec(blockCordsIntercept.x,blockCordsIntercept.y,blockCordsIntercept.z).dist(cvec(blockCords.x,blockCords.y+1,blockCords.z));
        side_temp = "y+1"
        blockPlaceLocation = cvec(blockCords.x,blockCords.y+1,blockCords.z);
      }
      
      if(cvec(blockCordsIntercept.x,blockCordsIntercept.y,blockCordsIntercept.z).dist(cvec(blockCords.x,blockCords.y-1,blockCords.z)) < distance_temp){
        distance_temp = cvec(blockCordsIntercept.x,blockCordsIntercept.y,blockCordsIntercept.z).dist(cvec(blockCords.x,blockCords.y-1,blockCords.z));
        side_temp = "y-1"
        blockPlaceLocation = cvec(blockCords.x,blockCords.y-1,blockCords.z);
      }
      
      if(cvec(blockCordsIntercept.x,blockCordsIntercept.y,blockCordsIntercept.z).dist(cvec(blockCords.x,blockCords.y,blockCords.z+1)) < distance_temp){
        distance_temp = cvec(blockCordsIntercept.x,blockCordsIntercept.y,blockCordsIntercept.z).dist(cvec(blockCords.x,blockCords.y,blockCords.z+1));
        side_temp = "z+1"
        blockPlaceLocation = cvec(blockCords.x,blockCords.y,blockCords.z+1);
      }

      
      if(cvec(blockCordsIntercept.x,blockCordsIntercept.y,blockCordsIntercept.z).dist(cvec(blockCords.x,blockCords.y,blockCords.z-1)) < distance_temp){
        distance_temp = cvec(blockCordsIntercept.x,blockCordsIntercept.y,blockCordsIntercept.z).dist(cvec(blockCords.x,blockCords.y,blockCords.z-1));
        side_temp = "z-1"
        blockPlaceLocation = cvec(blockCords.x,blockCords.y,blockCords.z-1);
      }
      setBlock(blockPlaceLocation, selected_slot);
      
      



    }
  }
  else if(mouseButton == LEFT){
    if(running){
      chunks[chunkBlockCords.x][chunkBlockCords.y].blocks[relativeBlockCords.x][blockCords.y][blockCords.z_relative].type = BlockTypes.AIR;
      chunks[chunkBlockCords.x][chunkBlockCords.y].cull();
      chunks[chunkBlockCords.x][chunkBlockCords.y].create_colission_map();
      
    }
  }
}

