//settings:
let gravity = 0.002;
let mouse_sens = 2;
let target_fps = 60;
let deceleration = 0.02; // Deceleration rate
let aceleration = 0.02; // Aceleration rate
let max_velo = 5;
let chunk_size = 32;
let world_size = 2;






//no changing
let running = false;

let textures = [];
let mouse_captured = false;


let grass_block_texture;

let fps = 0;

p5.disableFriendlyErrors = true; //performance












function preload() {//load textures
  loadBlockTextures();
  
}

function setup_() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL); 

  tex = canvas.getTexture(textures[BlockTypes.GRASS_BLOCK]);
  tex.setInterpolation(NEAREST, NEAREST);

  tex = canvas.getTexture(textures[BlockTypes.STONE]);
  tex.setInterpolation(NEAREST, NEAREST);

  tex = canvas.getTexture(textures[BlockTypes.DIRT]);
  tex.setInterpolation(NEAREST, NEAREST);
  
  

  translate(0,0,0);
  //textureMode(NORMAL);

  //frameRate(target_fps);

  noStroke(); // kein drahtgitter

  chunks = new Array(world_size);

  for (let i = 0; i < world_size; i++) {
    chunks[i] = new Array(world_size);
  }

  

  perspective(90, window.width/window.height, 0.1, 10000);
  let generated_chunks = 0;
  for (let x = 0; x < world_size; x++) {
  for (let z = 0; z < world_size; z++) {
    chunks[x][z] = new Chunk(x*chunk_size, 0, z*chunk_size, generated_chunks);
    generated_chunks++;
  }}

  setInterval(function(){fps = frameRate();}, 100)
  running = true;
  
}

function draw() {
  if(running){

    
    
    background("#78A7FF"); // sky

    let c = color(255, 0, 0);
    lights();
    //pointLight(color(255, 0, 0), 0, -150, 0);
    //pointLight(color(0, 255, 0), 0, 150, 0);
    //pointLight(color(0, 0, 255), 0, 0, 150);

    translate(0,0,0);
    for (let x = 0; x < world_size; x++) {
    for (let z = 0; z < world_size; z++) {
      chunks[x][z].render();
    }}


    orbitControl(mouse_sens,mouse_sens,mouse_sens);

    document.getElementById("topleft_info").innerHTML = `${Math.round(fps)} FPS`;
  }
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cam.perspective(2, width / height, 0.1, 1000);
} 
