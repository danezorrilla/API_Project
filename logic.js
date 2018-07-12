// Global Varibles


var map; //infoWindow;
var pos;
var ll;

// array to hold the names of the venue
var nameArr = [];
// array to hold the address of the venue
var addressArr = [];
// array to hold the cities of the venue
var cityArr = [];
// array to hold the latitude of the venue
var latArr = [];
// array to hold the longitude of the venue
var lngArr = [];
// array to hold the coordinates of the venue
var coordinatesArr = [];
// array to hold the parking near the venue
var parkingMarkers = [];
// array to hold the markers of the venue
var venueMarkerArr = [];
// array to hold the names of the parking lots
var pNameArr = [];
// array to hold the address of the parking lots
var pAddressArr = [];
// array to hold the latitude of the parking lots
var pLatArr = [];
// array to hold the longitude of the parking lots
var pLngArr = [];

// Functions

// Initialize and add the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 34.052, lng: -118.243 },
        zoom: 12
    });

}

// function that gets the geographic location of a user or computer device
function geolocate() {
    if (navigator.geolocation) {
        $("#spinner").show(0).delay(5000).hide(0);
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: {
                    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    scale: 7
                },
            });
            ll = pos.lat.toFixed(3) + "," + pos.lng.toFixed(3);
            venueMarkerArr.push(marker);
            // infoWindow.setPosition(pos);
            // infoWindow.setContent('Location found.');
            // infoWindow.open(map);
            map.setCenter(pos);

            gatherVenueLoc();
            // if (parking) {
            //     gatherParking();
            // }
            $("#content").show(3000);


            // venueMarker.addListener('click', function () {
            //     infowindow.open(map, venueMarker);
            // });

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        //Get city from text-box
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

// locates the city the user enters 
function citylocate() {

    console.log(map);
    
    $("#spinner").show(0).delay(3000).hide(0);
    var city = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDuToiVpZ6ZupdIvTQLvUgRotodcIQF5Bc&"



    city += $.param({
        'address': $("#autocomplete").val().trim()
    });


    $.ajax({
        url: city,
        method: 'GET',

    }).done(function (response) {
        var citypos = {
            lat: 0,
            lng: 0
        };
        citypos.lat = response.results[0].geometry.location.lat;
        citypos.lng = response.results[0].geometry.location.lng;
        console.log(citypos);

        var marker = new google.maps.Marker({
            position: citypos,
            map: map,
            icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 7
            },
        });    
        ll = citypos.lat.toFixed(3) + "," + citypos.lng.toFixed(3);
        venueMarkerArr.push(marker);
        map.setCenter(citypos);
    
        gatherVenueLoc();

        $("#content").show(3000);
    });
}

// function that handles any location errors
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

// function that gets the venues near the designated location
function gatherVenues() {
    var mit = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?rankby=distance&type=bar&key=AIzaSyDuToiVpZ6ZupdIvTQLvUgRotodcIQF5Bc&";

    mit += $.param({
        'location': ll
    });

    $.ajax({
        url: mit,
        method: 'GET',

    }).done(function (response) {

        for (var i = 0; i < response.results.length; i++) {
            // console.log(response.results[i].name);
            // console.log(response.results[i].vicinity);
            nameArr.push(response.results[i].name);
            addressArr.push(response.results[i].vicinity);


        }
        gatherVenueLoc();
        console.log(nameArr);
        console.log(addressArr);
    });

}

// function that displays a list of venues near the location
function gatherVenueLoc() {
    // store the client id of the Foursquare API
    var Client_Id = 'J1PHCGTIASTA4VYZJWDPBO1QRVPUAFGKTDHAN3JU0L1CPACB';

    // store the client key of the Foursquare API
    var Client_Secret = 'SKCVKYSDF052NOZZESTDU1SUXF4GO1CJDBK045V4JBG33OF2';

    // store the url of the expolre endpoint in the Foursquare API
    var url = 'https://api.foursquare.com/v2/venues/explore?limit=10&client_id=';

    // stores the latest version of the Foursquare API, 
    var v = '20180706';

    var queryURL;
    q = $('input[type=text]').val();

    queryURL = url + Client_Id + '&client_secret=' + Client_Secret + '&ll=' + ll + '&query=' + q + '&v=' + v;

    // bypass CORS
    var corsAnywhere = "https://cors-anywhere.herokuapp.com/";

    $.ajax({
        url: corsAnywhere + queryURL,
        method: 'GET'
    }).then(function (res) {
        console.log(res);
        var results = res.response.groups[0].items;
        for (var x = 0; x < results.length; x++) {
            // create a div the holds the venue
            var venueDiv = $('<div class="list">');
            // store the result of the ajax call on a paragraph tag
            var p = $("<p id='result" + x + "'><strong><a class='side'target='_blank' href=http://www.google.com/search?q=" + results[x].venue.name.replace(/ /g, "+") + ">" + results[x].venue.name + "</a></strong>" + "<br>" + results[x].venue.location.formattedAddress[0] + "<br>" + results[x].venue.location.formattedAddress[1] + "</p>");
            // store the latitude of the venue
            var lat = results[x].venue.location.lat;
            // push the latitude to the latitude array
            latArr.push(lat);
            // store the longitude of the venue
            var long = results[x].venue.location.lng;
            // push the longitude to the longitude of the venue
            lngArr.push(long);
            // appends the results to the venue div
            venueDiv.append(p);
            // creates a button that will display the parking near the venue
            var newButton = $("<button>").text("Show nearby parking");
            newButton.addClass("parking");
            newButton.attr("data-id", x);
            venueDiv.append(newButton);
            // var yelp = $("<a class='yelpPage' target='_blank' href=" + yelpUrl + "> Yelp Page</a>");
            $('#venueList').append(venueDiv);
            // push the name of the venue in the name array
            nameArr.push(results[x].venue.name);
            // push the address of the venue in the address array
            addressArr.push(results[x].venue.location.formattedAddress[0]);
            // push the city of the venue in the city array
            cityArr.push(results[x].venue.location.formattedAddress[1]);
            // stores the venues latitude and longitude coordinates
            var venueCoordinates = lat.toFixed(3) + "," + long.toFixed(3);
            // push the coordinates to the corrdinates array
            coordinatesArr.push(venueCoordinates);

        }
        console.log(latArr);
        console.log(lngArr);
        plotVenues();
        // gets rid of the parking icon when the show nearby parking button is clicking
        $(document).on("click", ".parking", function () {
            clearOverlays();
            var num = $(this).attr("data-id");
            console.log(num);
            for (let z = 0; z < results.length; z++) {
                if (num == z) {
                    gatherParking(coordinatesArr[z]);

                }
            }
        })
    });

}

// function that plots the venues on the map
function plotVenues() {
    var venueMarker;
    var contentString;
    var myLatLng = { lat: 0, lng: 0 };
    for (var k = 0; k < latArr.length; k++) {
        myLatLng.lat = latArr[k];
        myLatLng.lng = lngArr[k];


        venueMarker = new google.maps.Marker({
            position: myLatLng,
            map: map
        });
        venueMarkerArr.push(venueMarker);

        contentString = "<a target='_blank' href=http://www.google.com/search?q=" + nameArr[k].replace(/ /g, "+") + ">" + nameArr[k] + "</a>" + "<br>" + addressArr[k] + "<br>" + cityArr[k];
        var infowindows = new google.maps.InfoWindow();
        google.maps.event.addListener(venueMarker, 'click', (function (venueMarker, contentString, infowindows) {
            return function () {
                map.setCenter(venueMarker.getPosition());
                infowindows.setContent(contentString);
                infowindows.open(map, venueMarker);
            };
        })(venueMarker, contentString, infowindows));

    }
    map.setZoom(14);


}

// clears the markers on the map
function clearVenues() {
    for (var e = 0; e< venueMarkerArr.length; e++) {
        venueMarkerArr[e].setMap(null);
    }
    venueMarkerArr.length = 0;
    venueMarkerArr = [];
    nameArr = [];
    addressArr = [];
    latArr = [];
    lngArr = [];
    cityArr = [];
    coordinatesArr = [];
}

// clears the parking of the previous venue
function clearOverlays() {
    for (var d = 0; d < parkingMarkers.length; d++) {
        parkingMarkers[d].setMap(null);
    }
    parkingMarkers.length = 0;
    parkingMarkers = [];
    pNameArr = [];
    pAddressArr = [];
    pLatArr = [];
    pLngArr = [];
}

// display parking near a venue
function plotParking() {
    var parkingMarker;
    var parkingString;
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var icons = {
        parking: {
            icon: iconBase + 'parking_lot_maps.png'
        }
    };
    var pLatLng = { lat: 0, lng: 0 };



    for (var m = 0; m < pLatArr.length; m++) {

        pLatLng.lat = pLatArr[m];
        pLatLng.lng = pLngArr[m];


        parkingMarker = new google.maps.Marker({
            position: pLatLng,
            map: map,
            icon: icons.parking.icon
        });

        parkingMarkers.push(parkingMarker);


        parkingString = "<a target='_blank' href=http://www.google.com/search?q=" + pNameArr[m].replace(/ /g, "+") + ">" + pNameArr[m] + "</a>" + "<br>" + pAddressArr[m];
        var infowindows = new google.maps.InfoWindow();
        google.maps.event.addListener(parkingMarker, 'click', (function (parkingMarker, parkingString, infowindows) {
            return function () {
                infowindows.setContent(parkingString);
                infowindows.open(map, parkingMarker);
            };
        })(parkingMarker, parkingString, infowindows));

    }
    console.log(pLatArr)
    // map.setZoom(14);
    console.log(parkingMarkers);


}

// function that gets the parking near a venue using Google Places API
function gatherParking(coordinates) {
    var corsAnywhere = "https://cors-anywhere.herokuapp.com/";
    var nearbyParking = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?rankby=distance&type=parking&key=AIzaSyDuToiVpZ6ZupdIvTQLvUgRotodcIQF5Bc&";

    nearbyParking += $.param({
        'location': coordinates
    });

    $.ajax({
        url: corsAnywhere + nearbyParking,
        method: 'GET',

    }).done(function (response) {
        console.log(response.results.length)
        for (var n = 0; n < 5; n++) {
            // console.log(response.results[i].name);
            // console.log(response.results[i].vicinity);
            pNameArr.push(response.results[n].name);
            pAddressArr.push(response.results[n].vicinity);


        }
        gatherParkingLoc();
        console.log(pNameArr);
        console.log(pAddressArr);
        console.log(response);
    });

}

// function the gets the parking lots location near a venue using Google Maps API
function gatherParkingLoc() {
    for (let j = 0; j < pAddressArr.length; j++) {

        var plot = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDuToiVpZ6ZupdIvTQLvUgRotodcIQF5Bc&"

        plot += $.param({
            'address': pAddressArr[j]
        });
        console.log(plot)


        $.ajax({
            url: plot,
            method: 'GET',

        }).done(function (response) {
            // console.log(j);
            // console.log(response);
            // console.log(response.results[0]);
            pLatArr.push(response.results[0].geometry.location.lat);
            pLngArr.push(response.results[0].geometry.location.lng);
            plotParking();


        });
    }
}




