function draw_block_selector(x,y,z){
  push();
  translate(x*10,y*10,z*10);
  fill(0, 0, 0, 50);
  stroke(0); // Black border
  strokeWeight(0.5); // Border thickness
  box(10.1); //no z-fighting
  pop();
}