function generateCards() {
    fetch('/location_card_info')
        .then(function(response) {
        return response.json();
    })
        .then(function(data) {
        let cols = 3; // 3 cards per row
        let rows = Math.ceil(data.length/cols);
        let k = 0;
        let text = "";

        for (let i = 0; i < rows; i++) {
            
            text = "";
            text = text + '<div class="card-deck" id = "deck">';
            
            for (let j = 0; j < cols; j++) {
                k = i*cols + j;
                
                text = text + '<div class="card" id = "card">';
                text = text + '<a href="' + (i+1) + '"><img class="card-img-top" id = "img_url" src="';
                text = text + '../assets/img/' + data[k].img_url + '" alt="Card image cap"></a>';
                text = text + '<div class="card-body">';
                text = text + '<a href="' + (i+1) + '"><h5 class="card-title" id = "name">' + data[k].name + '</h5></a>';
                text = text + '<p class="card-text" id = "desc">' + data[k].desc + '</p>';
                text = text + '</div>';
                text = text + '</div>';
            }
            
            text = text + '</div>';
            
            $("#card-container").append(text);
        }
        $("#card-container").show();
    });
}

function startup() {
    $('#card-container').hide();
    generateCards();
}

$(document).ready(function() {
    console.log("Location script running...");
    startup();
});
