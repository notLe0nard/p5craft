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
    let chunkx = Math.floor(((round(rover.position.x/10)))/chunk_size);
    let chunkz = Math.floor(((round(rover.position.z/10)))/chunk_size);

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
    document.getElementById("topleft_info").innerHTML = `
    ${Math.round(fps)} FPS<br>
    X: ${round(rover.position.x/10)} Y: ${round(rover.position.y/10)} Z: ${round(rover.position.z/10)}<br>
    Chunk X: ${chunkx} Z: ${chunkz}<br>    
    Vel X: ${round(rover.velocity.x)} Y: ${round(rover.velocity.y)} Z: ${round(rover.velocity.z)}`;

    
  }
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cam.perspective(2, width / height, 0.1, 1000);
} 



function keyPressed(){
  //print(keyCode);
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



