//settings:
let gravity = 1;
let mouse_sens = 2;
let target_fps = 60;
let chunk_size = 32;
let world_size = 2;
let walking_speed = .2;






//no changing
let running = false;

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


let fps = 0;

p5.disableFriendlyErrors = true; //performance


var rover;






//movement
let jump = false;



async function setup_() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL); 
  loadBlockTextures(canvas);


  

  translate(0,0,0);
  //textureMode(NORMAL);

  //frameRate(target_fps);

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

    
    
    background("#78A7FF"); // sky

    let c = color(255, 0, 0);
    lights();

    translate(0,0,0);

    //render chunks
    for (let x = 0; x < world_size; x++) {
    for (let z = 0; z < world_size; z++) {
      chunks[x][z].render();
    }}


    
    //calculate what chunk the player is in
    chunkx = Math.floor(((round(rover.position.x/10)))/chunk_size);
    chunkz = Math.floor(((round(rover.position.z/10)))/chunk_size);



    let height_to_be = chunks[chunkx][chunkz].collision_map[round(rover.position.x/10)-chunkx*chunk_size][round(rover.position.z/10)-chunkz*chunk_size] * 10 - 20;

    
    //gravity
    if(rover.position.y < height_to_be + 0.4 && rover.position.y > height_to_be - 0.4){
      rover.position.y = height_to_be;
    }
    else{
      if(rover.position.y < height_to_be){
        rover.velocity.y += gravity// * (height_to_be - rover.position.y);
      }
      if(rover.position.y > height_to_be){
        rover.velocity.y -= gravity// * (rover.position.y - height_to_be);
      }
      
    }
    
    
    if(jump){
      rover.velocity.y = -10;
    }


    // Position the object in front of the camera
    let distance = 20; // Distance from the camera
    cubeX = rover.position.x + cos(rover.pan) * cos(rover.tilt) * distance;
    cubeY = rover.position.y + sin(rover.tilt) * distance;
    cubeZ = rover.position.z + sin(rover.pan) * cos(rover.tilt) * distance;

    //snap to blocks
    cubeX = round(cubeX/10);
    cubeY = round(cubeY/10);
    cubeZ = round(cubeZ/10);

    //relative to chunk
    cubeX_relative = cubeX-chunkx*chunk_size;
    cubeZ_relative = cubeZ-chunkz*chunk_size;

    

    draw_block_selector(cubeX,cubeY,cubeZ);

    document.getElementById("topleft_info").innerHTML = `
    ${Math.round(fps)} FPS Frametime: ${Math.round(deltaTime)}<br>
    X: ${round(rover.position.x/10)} Y: ${round(rover.position.y/10)} Z: ${round(rover.position.z/10)}<br>
    Chunk X: ${chunkx} Z: ${chunkz}<br>    
    Vel X: ${round(rover.velocity.x)} Y: ${round(rover.velocity.y)} Z: ${round(rover.velocity.z)}<br>
    Looking: X:${round(rover.pan)} Y:${round(cubeY)} Z:${round(cubeZ)}`;

    
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
  }
  
}

function keyReleased(){
  //print(keyCode);
  if(keyCode == 32){
    jump = false;
  }
}

function mousePressed(){
  if(mouseButton == RIGHT){
    if(running){

      chunks[chunkx][chunkz].blocks[cubeX_relative][cubeY][cubeZ_relative].type = selected_slot;
      if(chunks[chunkx][chunkz].generated_blocks.includes(selected_slot) == false && selected_slot != BlockTypes.AIR){
        chunks[chunkx][chunkz].generated_blocks.push(selected_slot);
      }
      chunks[chunkx][chunkz].cull();
      chunks[chunkx][chunkz].create_colission_map();
    }
  }
  else if(mouseButton == LEFT){
    if(running){
      chunks[chunkx][chunkz].blocks[cubeX_relative][cubeY][cubeZ_relative].type = BlockTypes.AIR;
      chunks[chunkx][chunkz].cull();
      chunks[chunkx][chunkz].create_colission_map();
      
    }
  }
}

