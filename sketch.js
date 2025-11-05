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


//chunk cordinates the player is in
let chunkx = 0;
let chunkz = 0;

//cordinates of the block the player is facing
let cubeX = 0;
let cubeY = 0;
let cubeZ = 0;

let cubeX_relative = 0; 
//y is the same
let cubeZ_relative = 0;

let block_chunkx = 0;
let block_chunkz = 0;



let fps = 0;

p5.disableFriendlyErrors = true; //performance


var rover;


let height_to_be;



//movement
let jump = false;



async function setup_() {
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
  for (let z = 0; z < world_size; z++) {
    chunks[x][z] = new Chunk(x*chunk_size, 0, z*chunk_size, generated_chunks);
    generated_chunks++;
    document.getElementById("loading_bar").style.width = generated_chunks / chunks_to_generate * 85 + "vmin";
    document.getElementById("loading_info").innerHTML = "generating chunk:" + generated_chunks + "/" + chunks_to_generate + "<br>";
    await sleep(1);
  }}
  document.getElementById("loading_info").innerHTML = "culling...";
  setInterval(function(){fps = frameRate();}, 100)
  running = true;


  
}

function draw() {
  if(running){
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
    for (let z = 0; z < world_size; z++) {
      chunks[x][z].render();
      chunks[x][z].renderChunkBorders();
      
    }}


  
    chunkx = Math.floor((round(rover.position.x))/chunk_size);    
    chunkz = Math.floor((round(rover.position.z))/chunk_size);
    

    


    height_to_be = chunks[chunkx][chunkz].collision_map[round(rover.position.x)-chunkx*chunk_size][round(rover.position.z)-chunkz*chunk_size] -2;
    
    //gravity
    if(rover.position.y < height_to_be + 0.001 && rover.position.y > height_to_be - 0.001){
      rover.position.y = height_to_be;
    }
    else{
      if(rover.position.y < height_to_be){
        rover.velocity.y += gravity * delta;
      }else{
        rover.velocity.y = 0;
      }
      if(rover.position.y > height_to_be){
        rover.position.y = height_to_be;
      }
      
    }

    // Position the object in front of the camera
    let distance = 2; // Distance from the camera
    cubeX = rover.position.x + cos(rover.pan) * cos(rover.tilt) * distance;
    cubeY = rover.position.y + sin(rover.tilt) * distance;
    cubeZ = rover.position.z + sin(rover.pan) * cos(rover.tilt) * distance;

    //snap to blocks
    cubeX = round(cubeX);
    cubeY = round(cubeY);
    cubeZ = round(cubeZ);


    block_chunkx = Math.floor((round(cubeX))/chunk_size);    
    block_chunkz = Math.floor((round(cubeZ))/chunk_size);


    //relative to chunk
    cubeX_relative = cubeX-block_chunkx*chunk_size;
    cubeZ_relative = cubeZ-block_chunkz*chunk_size;
    
    draw_block_selector(cubeX,cubeY,cubeZ,color(0,0,0,0),color(0,0,0,255),0.01);

    document.getElementById("topleft_info").innerHTML = `
    ${Math.round(fps)} FPS Frametime: ${deltaTime}<br>
    delta: ${delta}<br>
    X: ${round(rover.position.x)} Y: ${round(rover.position.y)} Z: ${round(rover.position.z)}<br>
    Chunk X: ${chunkx} Z: ${chunkz}<br>    
    Vel X: ${round(rover.velocity.x)} Y: ${round(rover.velocity.y)} Z: ${round(rover.velocity.z)}<br>
    Block: X:${cubeX} Y:${cubeY} Z:${cubeZ}<br>
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
    rover.velocity.y = -.5
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

      chunks[block_chunkx][block_chunkz].blocks[cubeX_relative][cubeY][cubeZ_relative].type = selected_slot;
      if(chunks[block_chunkx][block_chunkz].generated_blocks.includes(selected_slot) == false && selected_slot != BlockTypes.AIR){
        chunks[block_chunkx][block_chunkz].generated_blocks.push(selected_slot);
      }
      chunks[block_chunkx][block_chunkz].cull();
      chunks[block_chunkx][block_chunkz].create_colission_map();
    }
  }
  else if(mouseButton == LEFT){
    if(running){
      chunks[block_chunkx][block_chunkz].blocks[cubeX_relative][cubeY][cubeZ_relative].type = BlockTypes.AIR;
      chunks[block_chunkx][block_chunkz].cull();
      chunks[block_chunkx][block_chunkz].create_colission_map();
      
    }
  }
}

