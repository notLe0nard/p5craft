function setBlock(location, blocktype){

    blockPlaceChunkX = worldCordsToLocalCords(location).chunkx;
    blockPlaceChunkZ = worldCordsToLocalCords(location).chunkz;
    
    blockPlaceLocalX = worldCordsToLocalCords(location).localx;
    blockPlaceLocalZ = worldCordsToLocalCords(location).localz;


    chunks[blockPlaceChunkX][blockPlaceChunkZ].blocks[blockPlaceLocalX][location.y][blockPlaceLocalZ].type = blocktype;
    if(chunks[blockPlaceChunkX][blockPlaceChunkZ].generated_blocks.includes(blocktype) == false && blocktype != BlockTypes.AIR){
        chunks[blockPlaceChunkX][blockPlaceChunkZ].generated_blocks.push(blocktype);
    }
    chunks[blockPlaceChunkX][blockPlaceChunkZ].cull();
    chunks[blockPlaceChunkX][blockPlaceChunkZ].create_colission_map();
}
