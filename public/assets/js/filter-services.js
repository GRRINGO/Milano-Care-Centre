function filterCards(idArray) { // A list of integers as input.
    $(".card").toggle(false); // Hiding all cards.
    
    for(var i = 0; i < idArray.length; i++) {
        $('#card' + idArray[i]).toggle(true);
    }
}

$(document).ready(function() {
    
    console.log("Ready!");
        
    $("#btnloc0").click(function() {
        filterCards([1, 2, 3, 4, 5, 6]);
    });

    $("#btnloc1").click(function() {
        filterCards([1, 3, 4]);
    });
    
    $("#btnloc2").click(function() {
        filterCards([2, 5, 6]);
    });
    
    $("#btnloc3").click(function() {
        filterCards([2, 6]);
    });
    
    $("#btnloc4").click(function() {
        filterCards([1, 3, 4]);
    });
    
    $("#btnloc5").click(function() {
        filterCards([5, 6]);
    });
    
    $("#btnloc6").click(function() {
        filterCards([2, 6]);
    });
});