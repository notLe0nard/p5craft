let hotbar_selector = document.getElementById("hotbar_selector")

let selected_slot = 0; //0 bis 8


// Add an event listener for the wheel event
window.addEventListener('wheel', function(event) {
    // Prevent the default scrolling behavior (optional)
    event.preventDefault();

    // Check the deltaY property to determine the scroll direction
    if (event.deltaY < 0) {
        selected_slot--;
    } else if (event.deltaY > 0) {
        selected_slot++;
    }
    if(selected_slot > 8){
        selected_slot = 0;
    } if(selected_slot < 0){
        selected_slot = 8;
    }

    hotbar_selector.style.transform = "translateY(-.2vmin) translateX(" + ((selected_slot * 4.55) - 0.1) + "vmin)"
});
