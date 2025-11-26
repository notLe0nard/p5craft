function executeCommand(string){
    if(string.startsWith("/")){
        string = string.slice(1);
        commandarray = string.split(" ");
        if (commandarray[0] == "say"){
            printCln(commandarray[1]);
        }
        else if (commandarray[0] == "setblock"){
            setBlock(createVector(commandarray[1], commandarray[2], commandarray[3]), commandarray[4]);
            printCln(`Placed ${commandarray[4]} at X:${commandarray[1]} Y:${commandarray[2]} Z:${commandarray[3]}`);
        }
        else if (commandarray[0] == "hagebuddne"){
            printCln(`<iframe width="1214" height="683" src="https://www.youtube.com/embed/9z5lxlwpfaM?list=RD9z5lxlwpfaM" title="Stille Buddne, heilige Buddne" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`);
        }
    }
}