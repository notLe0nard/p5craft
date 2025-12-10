function toChunkCords(x,z){
    chunkx = Math.floor((round(x))/chunk_size);    
    chunkz = Math.floor((round(y))/chunk_size);
    return{
        x: chunkx,
        z: chunkz,
    }
}

function toLocalCords(x,z){
    localx = x-chunkx*chunk_size;
    localz = z-chunkz*chunk_size;
    return{
        x: localx,
        z: localz,
    }
}