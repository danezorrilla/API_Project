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
            if (navigator.geolocation) {
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

                    gatherVenues();

                    // venueMarker.addListener('click', function () {
                    //     infowindow.open(map, venueMarker);
                    // });

                }, function () {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            } else {
                // Browser doesn't support Geolocation
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
            for (let j = 0; j < addressArr.length; j++) {

                var plot = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDuToiVpZ6ZupdIvTQLvUgRotodcIQF5Bc&"



                plot += $.param({
                    'address': addressArr[j]
                });
                console.log(plot)


                $.ajax({
                    url: plot,
                    method: 'GET',

                }).done(function (response) {
                    // console.log(j);
                    // console.log(response);
                    // console.log(response.results[0]);
                    latArr.push(response.results[0].geometry.location.lat);
                    lngArr.push(response.results[0].geometry.location.lng);
                    plotVenues();


                });
            }
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
                contentString = "<a target='_blank' href=http://www.google.com/search?q=" + nameArr[k].replace(/ /g, "+") + ">" + nameArr[k] + "</a>" + "<br>" + addressArr[k];
                var infowindows = new google.maps.InfoWindow();
                google.maps.event.addListener(venueMarker, 'click', (function (venueMarker, contentString, infowindows) {
                    return function () {
                        infowindows.setContent(contentString);
                        infowindows.open(map, venueMarker);
                    };
                })(venueMarker, contentString, infowindows));

            }



        }





