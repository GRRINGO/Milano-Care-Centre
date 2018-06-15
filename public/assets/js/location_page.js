
function loadMainContent() {
	let curr_path = window.location.pathname;

    fetch("/info" + curr_path, {
    	headers: new Headers({
			'internal': 'true'
		})
    }).then(function(response) {
        return response.json();
    })
        .then(function(data) {
        	$("#title1").replaceWith("<h1 class='display-4 title1'>"+data[0].name+"</h1>");
        	$("#title2").replaceWith("<li class='breadcrumb-item active title2' aria-current='page'>"+data[0].name+"</li>");      
            $("#img_path").replaceWith(`
            	<div id="img_path" class = "col-12 col-lg-7">
                     <img src="../../assets/img/`+data[0].img_url+`" class="img-fluid" alt="Responsive image">
                </div>`);
            $("#map_url").replaceWith(`
            	<div id="map_url" class="col-12 col-lg-5">
                     <iframe src="https://www.google.com/maps/embed?`+data[0].map_code+`"
                      width="100%" height="381" frameborder="0" style="border:0" allowfullscreen></iframe>
                </div>`);
            $("#country").replaceWith(`<td id="country">`+data[0].country+`</td>`);
            $("#city").replaceWith(`<td id="city">`+data[0].city+`</td>`);
            $("#postal_code").replaceWith(`<td id="postal_code">`+data[0].postal_code+`</td>`);
            $("#address").replaceWith(`<td id="address">`+data[0].address+`</td>`);
            
            $("#mon_thu").replaceWith(`<td id="mon_thu">`+data[0].mon_thu_open+`</td>`);
            $("#fri").replaceWith(`<td id="fri">`+data[0].fri_open+`</td>`);
            $("#sat_sun").replaceWith(`<td id="sat_sun">`+data[0].sat_sun_open+`</td>`);
            
            text = `<ul id="services_provided" class="list-group">`;
        	if (data[0].service0 != "NULL"){
        		text = text +  `<a href = "../services/service_1.html"><li class="list-group-item list-group-item-action">`+data[0].service0+`</li></a>`;
        	};
        	if (data[0].service1 != "NULL"){
        		text = text +  `<a href = "../services/service_2.html"><li class="list-group-item list-group-item-action">`+data[0].service1+`</li></a>`;
        	};
        	if (data[0].service2 != "NULL"){
        		text = text +  `<a href = "../services/service_3.html"><li class="list-group-item list-group-item-action">`+data[0].service2+`</li></a>`;
        	};
            text = text + `</ul>`;
            $("#services_provided").replaceWith(text);
    });
}

function loadLocationLinks() {
	let curr_path = window.location.pathname;
	fetch("/location_card_info")
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			text = `<div id="locations_links_list" class="list-group">`
            for (let i = 0; i < data.length; i++) {
            	if (curr_path == (`/locations/`+(i+1))){
            		text = text + `<a href="/locations/`+ (i+1) + `" class="list-group-item list-group-item-action active">` + data[i].name + `</a>`;
            	} else {
            		text = text + `<a href="/locations/`+ (i+1) + `" class="list-group-item list-group-item-action">` + data[i].name + `</a>`;
            	}
            };
            text = text + `</div>`;

            $("#locations_links_list").replaceWith(text);
		})

}

function startup() {
    loadMainContent();
    loadLocationLinks();
}

$(document).ready(function() {
    console.log("Location script running...");
    startup();
});