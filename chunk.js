class Chunk{
  
  constructor(posX,posY,posZ,id) {
    this.id = id;
    this.position = {x:posX,y:posY,z:posZ};
    this.block_size = 10;
    this.block_id = 0;
    this.shapes = [];
    this.generated_blocks = []; //array of blocks with different textures to render because p5 texture and build geometry do not mix (obviusly)
    //for (let x = 0; x < 5; x++) {
    //  for (let y = 0; y < 5; y++) {
    //    for (let z = 0; z < 5; z++) {
    //      if(Math.random() > 0.5){
    //        this.blocks[this.block_id] = new Block(x*this.block_size, y*this.block_size, z*this.block_size, "grass_block", this.block_id, this.id);
    //        console.log(x,z);
    //        this.block_id++;
    //      }
    //    }
    //  }
    //}

    
    const depth = chunk_size; // Number of 2D arrays
    const rows =  chunk_size;  // Number of rows in each 2D array
    const cols =  chunk_size;  // Number of columns in each row´
    let block_type = "";
    this.chunk_generated = false;
    

    this.blocks = new Array(depth);
    for (let i = 0; i < depth; i++) {
      this.blocks[i] = new Array(rows);
      for (let j = 0; j < rows; j++) {
        this.blocks[i][j] = new Array(cols);
      }
    }



    this.collision_map = new Array(depth);
    for (let i = 0; i < depth; i++) {
      this.collision_map[i] = new Array(rows);
    }



    for (let x = this.position.x; x < chunk_size + this.position.x; x++) {
    for (let y = this.position.y; y < chunk_size + this.position.y; y++) {
    for (let z = this.position.z; z < chunk_size + this.position.z; z++) {
      let height_map = noise(x/20,z/20);
      
      if(y==round(map(height_map, 0,1,0,chunk_size))){
        this.collision_map[x-this.position.x][z-this.position.z] = y;
        block_type = BlockTypes.GRASS_BLOCK; //
      }else if(y>map(height_map, 0,1,0,chunk_size) && y<map(height_map, 0,1,0,chunk_size)+3){
        block_type = BlockTypes.DIRT;
      }else if(y>map(height_map, 0,1,0,chunk_size)){
        block_type = BlockTypes.STONE;
      }else{
        block_type = BlockTypes.AIR;
      }
      if(this.generated_blocks.includes(block_type) == false && block_type != BlockTypes.AIR){
        this.generated_blocks.push(block_type);
      }
      
      this.blocks[x-this.position.x][y-this.position.y][z-this.position.z] =  new Block(x, y, z, block_type, this.block_id, this.id);
      this.block_id++;
    }}}
    console.table(this.collision_map);


    this.cull();
    this.chunk_generated = true;
    console.table(this.generated_blocks);

    


  }
  cull(){
    this.chunk_generated = false;
    for (let x = this.position.x; x < chunk_size + this.position.x; x++) {
    for (let y = this.position.y; y < chunk_size + this.position.y; y++) {
    for (let z = this.position.z; z < chunk_size + this.position.z; z++) {
      this.blocks[x-this.position.x][y-this.position.y][z-this.position.z].check_blocked_faces(this);
    }}}



    let test = this;
    for(let i = 0; i < this.generated_blocks.length; i++){
      this.shapes[i] = buildGeometry(function(){
        for (let x = test.position.x; x < chunk_size + test.position.x; x++) {
        for (let y = test.position.y; y < chunk_size + test.position.y; y++) {
        for (let z = test.position.z; z < chunk_size + test.position.z; z++) {
          if(test.blocks[x-test.position.x][y-test.position.y][z-test.position.z].type == test.generated_blocks[i]){
            test.blocks[x-test.position.x][y-test.position.y][z-test.position.z].draw(10);
          }   
        }}}
      })
    }
    
    


    this.chunk_generated = true;
  }


  create_colission_map(){
    for (let x = this.position.x; x < chunk_size + this.position.x; x++) {
      for (let y = this.position.y; y < chunk_size + this.position.y; y++) {
        for (let z = this.position.z; z < chunk_size + this.position.z; z++) {
          if(y > 0){
            if(this.blocks[x-this.position.x][(y-this.position.y)-1][z-this.position.z].type == BlockTypes.AIR &&
              this.blocks[x-this.position.x][y-this.position.y][z-this.position.z].type != BlockTypes.AIR){
              this.collision_map[x-this.position.x][z-this.position.z] = y;
            } 
          } 
        }
      }
    }
  }

  render(){
    if(this.chunk_generated){
      for(let i = 0; i < this.shapes.length; i++){
        texture(textures[this.generated_blocks[i]]); //AIR IDIOT
        model(this.shapes[i]);
      }
    }
    texture(0);
  }
}