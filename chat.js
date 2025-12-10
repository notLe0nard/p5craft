chat = document.querySelector("#chat")
chatinput = document.querySelector("#chatinput")

document.addEventListener("keyup", keyPressed2);
function keyPressed2(e) {
  print(e.keyCode);
  if(e.keyCode == 84 && chat_open == false){
    chat_open = true
    chatinput.style.height="50px"
    chatinput.style.opacity="1"
    chatinput.focus();
    chatinput.value = "";
    document.exitPointerLock();
  }
  if(e.keyCode == 13 && chat_open){
    sendChat(chatinput.value)
    chat_open = false
    chatinput.style.height="0px"
    chatinput.style.opacity="0"
    document.querySelector("#hud").focus();
  }
}

function sendChat(string){
  if (string.startsWith("/")){
    executeCommand(string);
  }
  else{
    printCln(string)
  }
}

function printCln(string){
  chat.innerHTML += "<br>" + string;
}