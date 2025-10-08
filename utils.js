function get_chunk_from_cordinates(x,y){
    return Math.floor(((round(x)))/chunk_size),Math.floor(((round(y)))/chunk_size); // make return x and y as vector
}