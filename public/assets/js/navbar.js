
function selectActive() {
    //Select second word from path. Lets say the address is
    //"/locations/2", we want to select only locations.
    let curr_path = window.location.pathname;
    let splitted = curr_path.split("/");
    let actual_location = splitted[1];

    if (actual_location == "") {
        $("#home_page").addClass("active");
        return;
    }  

    let selector_ = "a[href*=" + actual_location+"]";
    $(selector_).addClass("active");
    if (actual_location == "locations" || actual_location == "locations" ||
    actual_location == "locations" || actual_location == "who_we_are" ||
    actual_location == "events") {
        $("#navbarDropdown").addClass("active");
    }
}

function loadNavbar() {
    $("#navbar_placeholder").replaceWith(`
         <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class = "container">
                <a class="navbar-brand" href="/">
                    <img src="../../assets/img/centre-logo.png" height="30" class="d-inline-block align-top" alt="">
                    Milano Care Centre
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" 
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>.

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <a id="home_page" class="nav-link" href="/">Home<span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/news">News</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" 
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                About us
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="/who_we_are">Who we are</a>
                                <a class="dropdown-item" href="/services">Services</a>
                                <a class="dropdown-item" href="/locations">Locations</a>
                                <a class="dropdown-item " href="/persons">Persons</a>
                                <a class="dropdown-item" href="/events">Events</a>
                            </div>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/help_us">Help us</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/faq">FAQ</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/contact_us">Contact us</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `);
}

function startup() {
    loadNavbar();
    selectActive();
}

startup();
