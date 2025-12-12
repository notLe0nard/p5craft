function draw_block_selector(x,y,z,color,stroke_color,border_thickness){
  push();
  translate(x,y,z);
  fill(color);
  stroke(stroke_color); 
  strokeWeight(border_thickness); // Border thickness
  box(1.01); //no z-fighting
  pop();
}