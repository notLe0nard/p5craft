function draw_block_selector(x,y,z,color,stroke_color){
  push();
  translate(x,y,z);
  fill(color);
  stroke(stroke_color); 
  strokeWeight(0.1); // Border thickness
  box(1.01); //no z-fighting
  pop();
}