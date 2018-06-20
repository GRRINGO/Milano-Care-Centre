function loadMainContent() {

    let curr_path = window.location.pathname;

    fetch("/info" + curr_path, {
        headers: new Headers({
            "internal": "true"
        })
    }).then(function(response) {
        return response.json();
    })
        .then(function(data) {
        $("#title1_service").replaceWith("<h1 class='display-4 title1'>"+data[0].name+"</h1>");
        $("#title2_service").replaceWith("<li class='breadcrumb-item active title2' aria-current='page'>"+data[0].name+"</li>");
        $("#text-text").replaceWith("<p class = 'text-text'>" + data[0].desc + "</p>");

        let details = data[0].details;
        let detailsArray = details.split("/");

        // The description of the details comes before the first "/".

        if (detailsArray.length > 0) {
            $("#details-desc").replaceWith("<p id='details-desc'>" + detailsArray[0] + "</p>");

            for (let i = 1; i < detailsArray.length; i++) {
                $("#details-list").append("<li>" + detailsArray[i] + "</li>");
            }
        }

    });
}

function loadServiceLinks() {
    let curr_path = window.location.pathname;
    fetch("/service_names")
        .then(function(response) {
        return response.json();
    })
        .then(function(data) {
        text = `<div id="services_links_list" class="list-group">`
        for (let i = 0; i < data.length; i++) {
            if (curr_path == (`/services/`+(i+1))){ // If this is the current service (for highlighting)
                text = text + `<a href="/services/`+ (i+1) + `" class="list-group-item list-group-item-action active">` + data[i].name + `</a>`;
            } else {
                text = text + `<a href="/services/`+ (i+1) + `" class="list-group-item list-group-item-action">` + data[i].name + `</a>`;
            }
        };
        text = text + `</div>`;

        $("#services_links_list").replaceWith(text);
    })
}

function loadTransitionalLinks() {
    let curr_path = window.location.pathname;
    let splitted = curr_path.split("/");
    let pageID = splitted[2];

    // Persons
    fetch("/persons_related_to_service/" + pageID)
        .then(function(response) {
        return response.json();
    })
        .then(function(data) {

        if (data.length === 0) {
            $("#person-list").append("<p>No associated persons</p>");
        }
        else {
            for (let i = 0; i < data.length; i++) {
                $("#person-list").append("<a href = '/persons/" + data[i].id + "'><li class='list-group-item list-group-item-action'>" + data[i].first_name + " " + data[i].last_name + "</li></a>");
            }
        }
    });
    
    //Locations
     fetch("/locations_related_to_service/" + pageID)
        .then(function(response) {
        return response.json();
    })
        .then(function(data) {

        if (data.length === 0) {
            $("#location-list").append("<p>No associated locations</p>");
        }
        else {
            for (let i = 0; i < data.length; i++) {
                $("#location-list").append("<a href = '/locations/" + data[i].id + "'><li class='list-group-item list-group-item-action'>" + data[i].name + "</li></a>");
            }
        }
    });
}

function startup() {
    loadMainContent();
    loadServiceLinks();
    loadTransitionalLinks();
}

$(document).ready(function() {
    console.log("Service script running...");
    startup();
});