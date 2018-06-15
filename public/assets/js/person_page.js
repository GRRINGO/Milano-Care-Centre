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
			let name = data[0].first_name + " " + data[0].last_name;
			$("#title1_person").replaceWith("<h1 class='display-4 title1'>"+name+"</h1>");
        	$("#title2_person").replaceWith("<li class='breadcrumb-item active title2' aria-current='page'>"+name+"</li>");
        	$("#img_path_person").replaceWith(`
        		<div class = "col-md-4 col-12" id="img_path_person">
                    <img src="../../assets/img/` + data[0].img_url + `" class="img-fluid rounded person-img" alt="Responsive image">
                </div>`);
        	$("#gender").replaceWith(`<td id="gender">`+ capitalize(data[0].gender) +`</td>`);
        	$("#age").replaceWith(`<td id="age">`+ data[0].age +`</td>`);
        	$("#nationality").replaceWith(`<td id="nationality">`+ capitalize(data[0].nationality) +`</td>`);
        	$("#occupation").replaceWith(`<td id="occupation">`+capitalize(data[0].role) +`</td>`);
        	$("#phone_number").replaceWith(`<td id="phone_number">`+ data[0].phone_number +`</td>`);
        	$("#email_address").replaceWith(`<td id="email_address">`+ data[0].email +`</td>`);
        	$("#about_person").replaceWith(`
        		<p class = "title-text" id="about_person">About `+data[0].first_name+`</p>
        		<p class = "text-text">`+ data[0].desc +`</p>`);

        	check_bit = 0;

        	//Creaeting the services links list porb should be done in seperate
        	//function which makes a query with the assosiated services names to
        	//obtain the address/id. Not sure because services is not yet implemented. 
        	text = `<ul class="list-group" id="provides_services">`;
			if (data[0].service0 != "NULL") {
				text = text + `<a href = "../services/service_2.html"><li class="list-group-item list-group-item-action">`;
				text = text + data[0].service0;
				text = text + `</li></a>`;
				check_bit = 1;
			}
			if (data[0].service1 != "NULL") {
				text = text + `<a href = "../services/service_2.html"><li class="list-group-item list-group-item-action">`;
				text = text + data[0].service1;
				text = text + `</li></a>`;
				check_bit = 1;
			}
			if (check_bit == 0) {
				text = `<p class = "text-text">No associated services</p>`;
			}
			text = text + `</ul>`;
			$("#provides_services").replaceWith(text);
		});
}



function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function startup() {
	loadMainContent();
}

$(document).ready(function() {
	console.log("Person script runnin...");
	startup();
});