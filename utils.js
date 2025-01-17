function get_chunk_from_real_cordinates(x,y){
    return chunks[Math.floor(((round(x/10)))/chunk_size)][Math.floor(((round(y/10)))/chunk_size)];
}