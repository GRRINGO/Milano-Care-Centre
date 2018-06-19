# README

## Description

This project is to make a prototype of a website and the description specifies that the "web site is for a care center
or an association devoted to support children or young adults with disability, and their families". The development
of the front-end prototype was based on the C-, L- and P-IDM schemas from the design phase of the project. This
allowed for a quick startup of the front-end development and helped us structurize the work.

The back-end is based around the server running NodeJS. A REST interface is used to make AJAX calls to the server and 
dynamically populate the "template pages", which are stripped of content.

The project is hosted on Heroku: _https://polimi-hyp-2018-team-10643774.herokuapp.com/_

**This team is formed by:**

-  **Noah Nettey** 10643774 _noahakai.nettey@mail.polimi.it_
-  **Kristoffer Nesland** 10647810 _kristoffer.nesland@mail.polimi.it_

**Division of work:**

- The design for the web page was done together in meetings, before we started to actually produce code.

*** Front-end ***

- Noah worked on the frontpage, navbar, contact us and setup of BitBucket and Heroku.
- Kristoffer focused on services, locations and persons, including navigation within and between these.

*** Back-end ***

- Kristoffer experimented with how to dynamically populate index pages and the sub-pages.
- Noah structurized Kristoffers work and created the pages for locations and persons.
- Kristoffer created the pages for services and added dynamically loaded transitional links to services, locations and persons.
- Noah finalized the project and deployed it at Heroku.


**Client-side languages used:** 

- HTML
- JavaScript (with the use of jQuery)        
- CSS (including Bootstrap)

**Server-side languages used:**

- JavaScript (controlling NodeJS)

**Tenplate used:** No templates were used, but the site relies heavily on Bootstrap and its various components (navbar, cards and more).

**External vendors:**

- The embedded google maps, _https://developers.google.com/maps/documentation/embed/guide_

## Description of the REST API

All of the requests are of type GET

- /locations (Sending in the template of the location index.)
- /location_card_info (Retrieving name, description and image URL of all locations. Just the information that is needed for the index page.)
- /location_names (Retrieving only the names of all locations.)
- /locations/:id (Sending in the template of a location page.)
- /info/locations/:id (Retrieving all information stored in the database related to the location with the corresponding id.)
- /services_related_to_location/:id (Retrieving name and id of all services related to the location with the corresponding id. Used for transitional links.)

- /persons (Sending in the template of the person index.)
- /person_card_info (Retrieving name, description and image URL of all persons. Just the information that is needed for the index page.)
- /persons/:id (Sending in the template of a person page.)
- /info/persons/:id (Retrieving all information stored in the database related to the person with the corresponding id.)
- /services_related_to_person/:id (Retrieving name and id of all services related to the person with the corresponding id. Used for transitional links.)

- /services (Sending in the template of the service index.)
- /service_card_info (Retrieving name, description and image URL of all services. Just the information that is needed for the index page.)
- /service_names (Retrieving only the names of all services.)
- /services/:id (Sending in the template of a service page.)
- /info/services/:id (Retrieving name, description and details related to the service with the corresponding id. Only what is needed.)
- /persons_related_to_service/:id (Retrieving name and id of all persons related to the service with the corresponding id. Used for transitional links.)
- /locations_related_to_service/:id (Retrieving name and id of all locations related to the service with the corresponding id. Used for transitional links.)

- / (Sending in the static frontpage.)
- /who_we_are (Sending in a static html-file.)
- /contact_us (Sending in a static html-file.)
- /location_service_coupling (Retrieving all the connections between locations and services. Used for the filtering of services at the service index page.)


## Main problems faced during development

**Front-end:**

No major technical issues were faced during development. Time consuming activities were mainly due to change of
layout on pages. Take the backdrop-dark css-class as an example. To introduce more contrasts to the visuals, we
wrapped some of the content in a div of class backdrop-dark. Doing this for a single person is ok, but when this
must be done for all persons, locations and services, it takes up quite a lot of time. What we learnt from this is
that it is best to be satisfied with the apperance before introducing many pages with the same setup. With respect
to technical issues, we had some small problems with the script making the heart at "Who We Are" beat. It proved
that the min-version of jQuery did not support animation of CSS properties and the full version had to be loaded
for this page.

**Back-end:**

We first started looking at the possibilities to use a template engine called Jade and spent quite some time on experimenting with this. When 
we found out that the pages could not be rendered server-side, we had to abort this method. Next, we started working on a method where we send a
"template" html-file to the browser that then uses JavaScript to populate the "template" with content utilizing AJAX calls. The main problems were
faced server-side as it took some time to decide what info that had to be included in the database, how to structurize it and to get the queries
correct. A typical problem was that the transitional links from (for example) a person to a service did not point to the services that we wanted.
This had to do with confusion between starting indexing on 0 or 1. Futhermore, we had some problems when deploying the application as some of the
strings we wanted to load into the database were longer than 255 characters.

## Notes
Before this repository was made GitHub was used for version control.
For that reason there are not too many commits on this repository.
