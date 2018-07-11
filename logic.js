var map; //infoWindow;
var pos;
var ll;


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 34.052, lng: -118.243 },
        zoom: 12
    });
    // infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    
}
// $("#location-switch").on("click", function (){
//     geolocate();
// });


function geolocate(){
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

            // infoWindow.setPosition(pos);
            // infoWindow.setContent('Location found.');
            // infoWindow.open(map);
            map.setCenter(pos);

            gatherVenueLoc();
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

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}




var nameArr = [];
var addressArr = [];
var cityArr=[];
var latArr = [];
var lngArr = [];


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

function gatherVenueLoc() {
    // for (let j = 0; j < addressArr.length; j++) {

    //     var plot = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDuToiVpZ6ZupdIvTQLvUgRotodcIQF5Bc&"



    //     plot += $.param({
    //         'address': addressArr[j]
    //     });
    //     console.log(plot)


    //     $.ajax({
    //         url: plot,
    //         method: 'GET',

    //     }).done(function (response) {
    //         // console.log(j);
    //         // console.log(response);
    //         // console.log(response.results[0]);
    //         latArr.push(response.results[0].geometry.location.lat);
    //         lngArr.push(response.results[0].geometry.location.lng);
    var Client_Id = 'J1PHCGTIASTA4VYZJWDPBO1QRVPUAFGKTDHAN3JU0L1CPACB';

    var Client_Secret = 'SKCVKYSDF052NOZZESTDU1SUXF4GO1CJDBK045V4JBG33OF2';

    var url = 'https://api.foursquare.com/v2/venues/explore?limit=10&client_id=';

    var lc = '40.7,-74';

    var q = 'bar';

    var v = '20180706';

    var queryURL;
    q = $('input[type=text]').val();

    queryURL = url + Client_Id + '&client_secret=' + Client_Secret + '&ll=' + ll + '&query=' + q + '&v=' + v;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (res) {
        console.log(res);
        var results = res.response.groups[0].items;
        for (var x = 0; x < results.length; x++) {
            var venueDiv = $('<div class="list">');
            var p = $("<p id='result" + x + "'><strong><a class='side'target='_blank' href=http://www.google.com/search?q=" + results[x].venue.name.replace(/ /g, "+") + ">" + results[x].venue.name + "</a></strong>" + "<br>" + results[x].venue.location.formattedAddress[0] + "<br>" + results[x].venue.location.formattedAddress[1] + "</p>");
            var lat = results[x].venue.location.lat;
            latArr.push(lat);
            var long = results[x].venue.location.lng;
            lngArr.push(long);
            venueDiv.append(p);
            $('#venueList').append(venueDiv);
            nameArr.push(results[x].venue.name);
            addressArr.push(results[x].venue.location.formattedAddress[0]);
            cityArr.push(results[x].venue.location.formattedAddress[1]);

        }
        console.log(latArr);
        console.log(lngArr);
        plotVenues();

    });





    //     });
    // }
}


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
        contentString = "<a target='_blank' href=http://www.google.com/search?q=" + nameArr[k].replace(/ /g, "+") + ">" + nameArr[k] + "</a>" + "<br>" + addressArr[k] + "<br>" + cityArr[k];
        var infowindows = new google.maps.InfoWindow();
        google.maps.event.addListener(venueMarker, 'click', (function (venueMarker, contentString, infowindows) {
            return function () {
                infowindows.setContent(contentString);
                infowindows.open(map, venueMarker);
            };
        })(venueMarker, contentString, infowindows));

    }
    map.setZoom(15);


}
