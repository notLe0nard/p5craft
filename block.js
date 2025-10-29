const BlockTypes = {
  AIR:          0,
  GRASS_BLOCK:  1,
  DIRT:         2,
  STONE:        3,
  STONE_BRICKS: 4,
  COBBLESTONE:  5,
  BEDROCK:      6,
  OAK_LOG:      7,
  OAK_LEAVES:   8,
  OAK_PLANKS:   9,
  SHORT_GRASS:  10,
  
};



function loadBlockTextures(canvas){
  textures[BlockTypes.GRASS_BLOCK]  = loadImage("assets/textures/blocks/grass_block.png");
  textures[BlockTypes.DIRT]         = loadImage("assets/textures/blocks/dirt.png");
  textures[BlockTypes.STONE]        = loadImage("assets/textures/blocks/stone.png");
  textures[BlockTypes.STONE_BRICKS] = loadImage("assets/textures/blocks/stone_bricks.png");
  textures[BlockTypes.COBBLESTONE]  = loadImage("assets/textures/blocks/cobblestone.png");
  textures[BlockTypes.BEDROCK]      = loadImage("assets/textures/blocks/bedrock.png");
  textures[BlockTypes.OAK_LOG]      = loadImage("assets/textures/blocks/oak_log.png");
  textures[BlockTypes.OAK_LEAVES]   = loadImage("assets/textures/blocks/oak_leaves.png");
  textures[BlockTypes.OAK_PLANKS]   = loadImage("assets/textures/blocks/oak_planks.png");
  textures[BlockTypes.SHORT_GRASS]  = loadImage("assets/textures/blocks/short_grass.png");


  for(let x = 1; x <  textures.length; x++){
    tex = canvas.getTexture(textures[x]);
    tex.setInterpolation(NEAREST, NEAREST);
  }
  
  
}



class Block {
  constructor(posX,posY,posZ,type,id,chunk_id) {
    this.type = type;
    this.id = id;
    this.position = {x:posX,y:posY,z:posZ};
    
    this.chunk_id = chunk_id;
    this.blocked_faces = [false,false,false,false,false,false];
  }

  draw(){
    noStroke();
    if(this.type == BlockTypes.AIR){return;}
      push();
      translate(this.position.x, this.position.y, this.position.z);
      beginShape(QUADS);
      
      if(this.type == BlockTypes.GRASS_BLOCK){
        // Front face (mapped to the top-left square of the atlas)
        if(this.blocked_faces[0] == false){
          vertex(-1 / 2, -1 / 2, 1 / 2     , 0, 0);          // Top-left
          vertex(1 / 2, -1 / 2, 1 / 2      , 1 / 2, 0);       // Top-right
          vertex(1 / 2, 1 / 2, 1 / 2       , 1 / 2, 1 / 3);    // Bottom-right
          vertex(-1 / 2, 1 / 2, 1 / 2      , 0, 1 / 3);       // Bottom-left
        }

        // Back face
        if(this.blocked_faces[1] == false){
          vertex(1 / 2, -1 / 2, -1 / 2, 1 / 2, 0);      // Top-left
          vertex(-1 / 2, -1 / 2, -1 / 2, 1, 0);         // Top-right
          vertex(-1 / 2, 1 / 2, -1 / 2, 1, 1 / 3);      // Bottom-right
          vertex(1 / 2, 1 / 2, -1 / 2, 1 / 2, 1 / 3);   // Bottom-left
        }


        // Right face
        if(this.blocked_faces[2] == false){
          vertex(1 / 2, -1 / 2, 1 / 2, 1 / 2, 1 / 3);   // Top-left
          vertex(1 / 2, -1 / 2, -1 / 2, 1, 1 / 3);      // Top-right
          vertex(1 / 2, 1 / 2, -1 / 2, 1, 2 / 3);       // Bottom-right
          vertex(1 / 2, 1 / 2, 1 / 2, 1 / 2, 2 / 3);    // Bottom-left
        }

        // Left face
        if(this.blocked_faces[3] == false){
          vertex(-1 / 2, -1 / 2, -1 / 2, 0, 1 / 3);     // Top-left
          vertex(-1 / 2, -1 / 2, 1 / 2, 1 / 2, 1 / 3);  // Top-right
          vertex(-1 / 2, 1 / 2, 1 / 2, 1 / 2, 2 / 3);   // Bottom-right
          vertex(-1 / 2, 1 / 2, -1 / 2, 0, 2 / 3);      // Bottom-left
        }

        // Top face
        if(this.blocked_faces[4] == false){
          vertex(-1 / 2, -1 / 2, -1 / 2, 0, 2 / 3);     // Top-left
          vertex(1 / 2, -1 / 2, -1 / 2, 1 / 2, 2 / 3);  // Top-right
          vertex(1 / 2, -1 / 2, 1 / 2, 1 / 2, 1);       // Bottom-right
          vertex(-1 / 2, -1 / 2, 1 / 2, 0, 1);          // Bottom-left
        }

        // Bottom face
        if(this.blocked_faces[5] == false){
          vertex(-1 / 2, 1 / 2, 1 / 2, 1 / 2, 2 / 3);   // Top-left
          vertex(1 / 2, 1 / 2, 1 / 2, 1, 2 / 3);        // Top-right
          vertex(1 / 2, 1 / 2, -1 / 2, 1, 1);           // Bottom-right
          vertex(-1 / 2, 1 / 2, -1 / 2, 1 / 2, 1);      // Bottom-left
        }
      }else{
          // Front face
          if (this.blocked_faces[0] == false) {
              vertex(-1 / 2, -1 / 2, 1 / 2, 0, 0);        // Top-left
              vertex(1 / 2, -1 / 2, 1 / 2, 1, 0);         // Top-right
              vertex(1 / 2, 1 / 2, 1 / 2, 1, 1);          // Bottom-right
              vertex(-1 / 2, 1 / 2, 1 / 2, 0, 1);         // Bottom-left
          }
      
          // Back face
          if (this.blocked_faces[1] == false) {
              vertex(1 / 2, -1 / 2, -1 / 2, 0, 0);        // Top-left
              vertex(-1 / 2, -1 / 2, -1 / 2, 1, 0);       // Top-right
              vertex(-1 / 2, 1 / 2, -1 / 2, 1, 1);        // Bottom-right
              vertex(1 / 2, 1 / 2, -1 / 2, 0, 1);         // Bottom-left
          }
      
          // Right face
          if (this.blocked_faces[2] == false) {
              vertex(1 / 2, -1 / 2, 1 / 2, 0, 0);         // Top-left
              vertex(1 / 2, -1 / 2, -1 / 2, 1, 0);        // Top-right
              vertex(1 / 2, 1 / 2, -1 / 2, 1, 1);         // Bottom-right
              vertex(1 / 2, 1 / 2, 1 / 2, 0, 1);          // Bottom-left
          }
      
          // Left face
          if (this.blocked_faces[3] == false) {
              vertex(-1 / 2, -1 / 2, -1 / 2, 0, 0);       // Top-left
              vertex(-1 / 2, -1 / 2, 1 / 2, 1, 0);        // Top-right
              vertex(-1 / 2, 1 / 2, 1 / 2, 1, 1);         // Bottom-right
              vertex(-1 / 2, 1 / 2, -1 / 2, 0, 1);        // Bottom-left
          }
      
          // Top face
          if (this.blocked_faces[4] == false) {
              vertex(-1 / 2, -1 / 2, -1 / 2, 0, 0);       // Top-left
              vertex(1 / 2, -1 / 2, -1 / 2, 1, 0);        // Top-right
              vertex(1 / 2, -1 / 2, 1 / 2, 1, 1);         // Bottom-right
              vertex(-1 / 2, -1 / 2, 1 / 2, 0, 1);        // Bottom-left
          }
      
          // Bottom face
          if (this.blocked_faces[5] == false) {
              vertex(-1 / 2, 1 / 2, 1 / 2, 0, 0);         // Top-left
              vertex(1 / 2, 1 / 2, 1 / 2, 1, 0);          // Top-right
              vertex(1 / 2, 1 / 2, -1 / 2, 1, 1);         // Bottom-right
              vertex(-1 / 2, 1 / 2, -1 / 2, 0, 1);        // Bottom-left
          }
      }
      endShape();
      pop();
    }

  check_blocked_faces(chunk){
    try{if(chunk.blocks[this.position.x-chunk.position.x]    [this.position.y-chunk.position.y]    [this.position.z-chunk.position.z + 1].type == BlockTypes.AIR){this.blocked_faces[0] = false}else{this.blocked_faces[0] = true}}catch{this.blocked_faces[0] = false}
    try{if(chunk.blocks[this.position.x-chunk.position.x]    [this.position.y-chunk.position.y]    [this.position.z-chunk.position.z - 1].type == BlockTypes.AIR){this.blocked_faces[1] = false}else{this.blocked_faces[1] = true}}catch{this.blocked_faces[1] = false}
    try{if(chunk.blocks[this.position.x-chunk.position.x + 1][this.position.y-chunk.position.y]    [this.position.z-chunk.position.z].type == BlockTypes.AIR){this.blocked_faces[2] = false}else{this.blocked_faces[2] = true}}catch{this.blocked_faces[2] = false}
    try{if(chunk.blocks[this.position.x-chunk.position.x - 1][this.position.y-chunk.position.y]    [this.position.z-chunk.position.z].type == BlockTypes.AIR){this.blocked_faces[3] = false}else{this.blocked_faces[3] = true}}catch{this.blocked_faces[3] = false}
    try{if(chunk.blocks[this.position.x-chunk.position.x]    [this.position.y-chunk.position.y - 1][this.position.z-chunk.position.z].type == BlockTypes.AIR){this.blocked_faces[4] = false}else{this.blocked_faces[4] = true}}catch{this.blocked_faces[4] = false}
    try{if(chunk.blocks[this.position.x-chunk.position.x]    [this.position.y-chunk.position.y + 1][this.position.z-chunk.position.z].type == BlockTypes.AIR){this.blocked_faces[5] = false}else{this.blocked_faces[5] = true}}catch{this.blocked_faces[5] = false}
  }
}



//old code

//draw(1) {
//  // Draw a box with textured sides
//  
//  push();
//  translate(this.posX, this.posY, this.posZ);
//  beginShape();
//
//  // Top face (Grass)
//  texture(grassTopTexture);
//  vertex(-1, -1, -1, 0, 0);
//  vertex(1, -1, -1, 1, 0);
//  vertex(1, -1, 1, 1, 1);
//  vertex(-1, -1, 1, 0, 1);
//  endShape(CLOSE);
//  textureWrap();
//
//  // Bottom face (Dirt)
//  beginShape();
//  texture(grassSideTexture); // Using side texture for simplicity
//  vertex(-1, 1, 1, 0, 0);
//  vertex(1, 1, 1, 1, 0);
//  vertex(1, 1, -1, 1, 1);
//  vertex(-1, 1, -1, 0, 1);
//  endShape(CLOSE);
//
//  // Front face (Side)
//  beginShape();
//  vertex(-1, -1, 1, 0, 0);
//  vertex(1, -1, 1, 1, 0);
//  vertex(1, 1, 1, 1, 1);
//  vertex(-1, 1, 1, 0, 1);
//  endShape(CLOSE);
//
//  // Back face (Side)
//  beginShape();
//  vertex(-1, -1, -1, 0, 0);
//  vertex(1, -1, -1, 1, 0);
//  vertex(1, 1, -1, 1, 1);
//  vertex(-1, 1, -1, 0, 1);
//  endShape(CLOSE);
//
//  // Left face (Side)
//  beginShape();
//  texture(grassSideTexture);
//  vertex(-1, -1, -1, 0, 0);
//  vertex(-1, -1, 1, 1, 0);
//  vertex(-1, 1, 1, 1, 1);
//  vertex(-1, 1, -1, 0, 1);
//  endShape(CLOSE);
//
//  // Right face (Side)
//  beginShape();
//  texture(grassSideTexture);
//  vertex(1, -1, 1, 0, 0);
//  vertex(1, -1, -1, 1, 0);
//  vertex(1, 1, -1, 1, 1);
//  vertex(1, 1, 1, 0, 1);
//
//  endShape(CLOSE);
//  pop();
//}