	




function loadMainContent() {
	let myHeaders = new Headers({
    'internal': 'true'
	});

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
    });
}

function startup() {
    loadMainContent();
}

$(document).ready(function() {
    console.log("Location script running...");
    startup();
});