function worldCordsToLocalCords(location){
    chunkx = Math.floor((round(location.x))/chunk_size);    
    chunkz = Math.floor((round(location.z))/chunk_size);

    //relative to chunk
    localx = location.x-chunkx*chunk_size;
    localz = location.z-chunkz*chunk_size;


    return {
        localx: localx,
        localz: localz,
        chunkx: chunkx,
        chunkz: chunkz
    };
}