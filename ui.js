window.onload = async function() {
	await sleep(1);
	document.getElementById("loading_bar").style.width = "100vmin";
	document.querySelector("#singleplayer_menu").style.display = "none";
	
	await sleep(10);

	document.getElementById("loading_screen").style.opacity = 0;
	document.getElementById("loading_screen").style.display = "none";
	
}





function open_singleplayer_menu(){
	document.getElementById("singleplayer_menu").style.display = "flex";
	document.getElementById("main_menu").style.display = "none";
}

function open_main_menu(){
	document.getElementById("singleplayer_menu").style.display = "none";
	document.getElementById("main_menu").style.display = "flex";
}

async function generate_world(){
	document.getElementById("loading_bar").style.width = "0vmin";
	document.getElementById("loading_screen").style.display = "flex";
	await sleep(5);
	document.getElementById("loading_screen").style.opacity = 1;
	await sleep(500);

    document.getElementById("singleplayer_menu").style.display = "none";
    if(document.getElementById("world_size").value == "" || document.getElementById("chunk_size").value == ""){
		world_size = 2
		chunk_size = 16
	}else{
		world_size = Number(document.getElementById("world_size").value);
    	chunk_size = Number(document.getElementById("chunk_size").value);
	}
	
    await setup_();
	document.getElementById("loading_bar").style.width = "85vmin";


    document.getElementById("main_menu").style.display = "none";
	document.getElementById("loading_screen").style.opacity = 0;
	
	await sleep(500);
	document.getElementById("loading_screen").style.display = "none";
    
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
