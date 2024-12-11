window.onload = async function() {
	await sleep(1);
	document.getElementById("loading_bar").style.width = "10vmin";

	document.getElementById("main_menu").style.opacity = "0";
	document.getElementById("buttons").style.transform = "scale(10)";
	document.getElementById("loading_bar").style.width = "30vmin";
	await sleep(1);
	document.getElementById("main_menu").style.opacity = "1";
	document.getElementById("singleplayer_menu").style.display = "none";
	
	document.getElementById("loading_bar").style.width = "60vmin";
	document.getElementById("loading_bar").style.width = "85vmin";
	await sleep(300);
	document.getElementById("logo").style.transform = "scale(1)";
	document.getElementById("buttons").style.transform = "scale(1)";
	await sleep(300);
	document.getElementById("loading_screen").style.opacity = 0;
	
	await sleep(500);
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
    world_size = Number(document.getElementById("world_size").value);
    chunk_size = Number(document.getElementById("chunk_size").value);
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
