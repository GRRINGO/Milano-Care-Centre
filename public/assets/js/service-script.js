function generateCards() {
    fetch('/service_card_info')
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

                text = text + '<div class="card" id = "card' + (k + 1) + '">';
                text = text + '<a href="services/' + (k+1) + '"><img class="card-img-top" id = "img_url" src="';
                text = text + '../assets/img/' + data[k].img_url + '" alt="Card image cap"></a>';
                text = text + '<div class="card-body">';
                text = text + '<a href="services/' + (k+1) + '"><h5 class="card-title" id = "name">' + data[k].name + '</h5></a>';
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

function filterCards(idArray) { // A list of integers as input.
    $(".card").toggle(false); // Hiding all cards.

    for(var i = 0; i < idArray.length; i++) {
        $('#card' + idArray[i]).toggle(true);
    }
}

function addFiltering() { // Adding the buttons and the filtering effect itself
    let allLocations = [];
    
    fetch('/location_names')
        .then(function(response) {
        return response.json();
    })
        .then(function(data) {
        
        console.log(data);
        
        for (let i = 0; i < data.length; i++) {
            allLocations.push(data[i].name);
        }
    })

    fetch('/location_service_coupling')
        .then(function(response) {
        return response.json();
    })
        .then(function(data) {

        // Generating the buttons
        let generatedLocations = [];
        let numServices = 0; // Used to find the number of services which again is used to make a list of all services
        let locationID = -1;

        for (let i = 0; i < data.length; i++) {
            locationID = data[i].location_id;

            if (numServices < data[i].service_id) {
                numServices = data[i].service_id;
            }

            if (!generatedLocations.includes(locationID)) {
                $("#filter-buttons").append("<button type='button' class='filter-btn btn btn-secondary' id = 'btnloc-" + (locationID + 1) + "'>" + allLocations[locationID] + "</button>");
                generatedLocations.push(locationID);
            }
        }

        numServices = numServices + 1;
        let allServices = [];
        for (let i = 1; i <= numServices; i++) {
            allServices.push(i);
        }

        $(".filter-btn").click(function() {
            let locID = parseInt(((this).id).split("-")[1]);
            let relatedServices = [];
            
            console.log(locID);

            if (locID === 0) { // "Show all"
                relatedServices = allServices;
            }
            else {
                for (let i = 0; i < data.length; i++) {
                    if (locID === (data[i].location_id + 1)) {
                        relatedServices.push(data[i].service_id + 1);
                    }
                }
            }

            console.log(relatedServices);
            filterCards(relatedServices);
        });
    })
}


function startup() {
    $('#card-container').hide();
    generateCards();
    addFiltering();
}

$(document).ready(function() {
    console.log("Location script running...");
    startup();
});
