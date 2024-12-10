async function loadSite(){
	document.getElementById("main_menu").style.opacity = "0";
	document.getElementById("buttons").style.transform = "scale(10)";
	await sleep(1);
	document.getElementById("main_menu").style.opacity = "1";
	document.getElementById("singleplayer_menu").style.display = "none";
	document.getElementById("logo").style.transform = "scale(1)";
	document.getElementById("buttons").style.transform = "scale(1)";
}


function open_singleplayer_menu(){
	document.getElementById("singleplayer_menu").style.display = "flex";
	document.getElementById("main_menu").style.display = "none";
}

function open_main_menu(){
	document.getElementById("singleplayer_menu").style.display = "none";
	document.getElementById("main_menu").style.display = "flex";
}

function generate_world(){
    document.getElementById("singleplayer_menu").style.display = "none";
    world_size = Number(document.getElementById("world_size").value);
    chunk_size = Number(document.getElementById("chunk_size").value);
    setup_();


    document.getElementById("main_menu").style.display = "none";
    
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

loadSite();