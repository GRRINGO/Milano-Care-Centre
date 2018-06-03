function increaseWidth() {
    $("#logo-beat").animate({
        width: "75%"
    }, 200, function() {
        decreaseWidth();
    });
}
                            
function decreaseWidth() {
    $("#logo-beat").animate({
        width: "70%"
    }, 600, function() {
        increaseWidth();
    });
}


$(document).ready(function() {
    
    console.log("Ready!");
        
    increaseWidth();
});