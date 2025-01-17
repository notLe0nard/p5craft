function draw_block_selector(x,y,z,color,stroke_color){
  push();
  translate(x*10,y*10,z*10);
  fill(color);
  stroke(stroke_color); 
  strokeWeight(0.5); // Border thickness
  box(10.1); //no z-fighting
  pop();
}