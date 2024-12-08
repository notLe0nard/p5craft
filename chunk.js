class Chunk{
  
  constructor(posX,posY,posZ,id) {

    this.id = id;
    this.position = {x:posX,y:posY,z:posZ};
    this.block_size = 10;
    this.block_id = 0;
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

    for (let x = this.position.x; x < chunk_size + this.position.x; x++) {
    for (let y = this.position.y; y < chunk_size + this.position.y; y++) {
    for (let z = this.position.z; z < chunk_size + this.position.z; z++) {
      let height_map = noise(x/100,z/100);
      
      if(y>map(height_map, 0,1,0,chunk_size)){
        block_type = BlockTypes.GRASS_BLOCK;
      }else{
        block_type = BlockTypes.AIR;
      }

      this.blocks[x-this.position.x][y-this.position.y][z-this.position.z] =  new Block(x, y, z, block_type, this.block_id, this.id);
      this.block_id++;

      
    }}}


    for (let x = this.position.x; x < chunk_size + this.position.x; x++) {
    for (let y = this.position.y; y < chunk_size + this.position.y; y++) {
    for (let z = this.position.z; z < chunk_size + this.position.z; z++) {
      this.blocks[x-this.position.x][y-this.position.y][z-this.position.z].check_blocked_faces(this);
    }}}

    let test = this;
    this.shape = buildGeometry(function(){
      for (let x = test.position.x; x < chunk_size + test.position.x; x++) {
      for (let y = test.position.y; y < chunk_size + test.position.y; y++) {
      for (let z = test.position.z; z < chunk_size + test.position.z; z++) {
        test.blocks[x-test.position.x][y-test.position.y][z-test.position.z].draw(10);
      }}}
    })
    


    this.chunk_generated = true;
    console.table(this.blocks);
  }


  render(){
    if(this.chunk_generated){
      texture(grass_block_texture);
      model(this.shape);
    }
  }
}