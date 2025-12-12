function toChunkCords(vec){
    chunkx = Math.floor((round(vec.x))/chunk_size);    
    chunky = Math.floor((round(vec.y))/chunk_size);
    return cvec(chunkx, chunky);
}

function toLocalCords(vec){
    chunkx = Math.floor((round(vec.x))/chunk_size);    
    chunky = Math.floor((round(vec.y))/chunk_size);

    localx = vec.x-chunkx*chunk_size;
    localy = vec.y-chunky*chunk_size;
    return cvec(localx, localy);
}