var map; //infoWindow;
var pos;
var ll;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.052, lng: -118.243 },
    zoom: 12
  });
  // infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
}
// $("#location-switch").on("click", function (){
//     geolocate();
// });

function geolocate() {
  if (navigator.geolocation) {
    $("#spinner")
      .show(0)
      .delay(5000)
      .hide(0);
    navigator.geolocation.getCurrentPosition(
      function(position) {
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
          }
        });
        ll = pos.lat.toFixed(3) + "," + pos.lng.toFixed(3);

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
      },
      function() {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    //Get city from text-box
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
function citylocate() {
  console.log(map);

  $("#spinner")
    .show(0)
    .delay(3000)
    .hide(0);
  var city =
    "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyC6MpLf9jjhgCPBWJcpnqmIu2cZ21fsS8g&";

  city += $.param({
    address: $("#autocomplete")
      .val()
      .trim()
  });

  $.ajax({
    url: city,
    method: "GET"
  }).done(function(response) {
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
      }
    });
    ll = citypos.lat.toFixed(3) + "," + citypos.lng.toFixed(3);

    map.setCenter(citypos);

    gatherVenueLoc();

    $("#content").show(3000);
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

var nameArr = [];
var addressArr = [];
var cityArr = [];
var latArr = [];
var lngArr = [];
var coordinatesArr = [];
var parkingMarkers = [];
var venueMarkerArr = [];
var yelpArr = [];

function gatherVenues() {
  var mit =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?rankby=distance&type=bar&key=AIzaSyC6MpLf9jjhgCPBWJcpnqmIu2cZ21fsS8g&";

  mit += $.param({
    location: ll
  });

  $.ajax({
    url: mit,
    method: "GET"
  }).done(function(response) {
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
var yelpObj = {
  0: "url",
  1: "url",
  2: "url",
  3: "url",
  4: "url",
  5: "url",
  6: "url",
  7: "url",
  8: "url",
  9: "url"
};

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
  var Client_Id = "J1PHCGTIASTA4VYZJWDPBO1QRVPUAFGKTDHAN3JU0L1CPACB";

  var Client_Secret = "SKCVKYSDF052NOZZESTDU1SUXF4GO1CJDBK045V4JBG33OF2";

  var url = "https://api.foursquare.com/v2/venues/explore?limit=10&client_id=";

  var lc = "40.7,-74";

  var q = "bar";

  var v = "20180706";

  var queryURL;
  q = $("input[type=text]").val();

  queryURL =
    url +
    Client_Id +
    "&client_secret=" +
    Client_Secret +
    "&ll=" +
    ll +
    "&query=" +
    q +
    "&v=" +
    v;

  var corsAnywhere = "https://cors-anywhere.herokuapp.com/";

  $.ajax({
    url: corsAnywhere + queryURL,
    method: "GET"
  }).then(function(res) {
    console.log(res);
    var results = res.response.groups[0].items;
    for (var x = 0; x < results.length; x++) {
      var venueDiv = $('<div class="list">');
      var p = $(
        "<p id='result" +
          x +
          "'><strong><a class='side'target='_blank' href=http://www.google.com/search?q=" +
          results[x].venue.name.replace(/ /g, "+") +
          ">" +
          results[x].venue.name +
          "</a></strong>" +
          "<br>" +
          results[x].venue.location.formattedAddress[0] +
          "<br>" +
          results[x].venue.location.formattedAddress[1] +
          "</p>"
      );
      var lat = results[x].venue.location.lat;
      latArr.push(lat);
      var long = results[x].venue.location.lng;
      lngArr.push(long);
      venueDiv.append(p);
      var newButton = $("<button>").text("Show nearby parking");
      newButton.addClass("parking");
      newButton.attr("data-id", x);
      venueDiv.append(newButton);
      // var yelp = $("<a class='yelpPage' target='_blank' href=" + yelpUrl + "> Yelp Page</a>");
      var yelpButton = $("<button>Yelp Page</button>");
      yelpButton.attr("data-id", x);
      yelpButton.addClass("yelp");
      venueDiv.append(yelpButton);
      $("#venueList").append(venueDiv);
      nameArr.push(results[x].venue.name);
      addressArr.push(results[x].venue.location.formattedAddress[0]);
      cityArr.push(results[x].venue.location.formattedAddress[1]);
      var venueCoordinates = lat.toFixed(3) + "," + long.toFixed(3);
      coordinatesArr.push(venueCoordinates);
      gatherYelp(latArr[x], lngArr[x], nameArr[x], x);
    }
    console.log(latArr);
    console.log(lngArr);
    console.log(nameArr);
    console.log(yelpObj);

    plotVenues();
    $(document).on("click", ".parking", function() {
      clearOverlays();
      var num = $(this).attr("data-id");
      console.log(num);
      for (let z = 0; z < results.length; z++) {
        if (num == z) {
          gatherParking(coordinatesArr[z]);
        }
      }
    });
    $(document).on("click", ".yelp", function() {
      var num = $(this).attr("data-id");
      openInNewTab(yelpObj[num]);
      console.log(yelpArr);
    });
  });

  //     });
  // }
}

function openInNewTab(url) {
  var win = window.open(url, "_blank");
  win.focus();
}
function gatherYelp(latitude, longitude, name, x) {
  var corsAnywhere = "https://cors-anywhere.herokuapp.com/";
  var yelpAjax = "https://api.yelp.com/v3/businesses/search?";

  yelpAjax += $.param({
    latitude: latitude,
    longitude: longitude,
    term: name
  });

  var APIKey =
    "AoHv5RBkW0Q3YKYzJn8f9oBPQnjYwQGkaprTCe1P2NYA0IclszRH-UrlpiMX3pBnt5VlqvfYFz26MZpP3bV_Jb2chEdJ2s6mG1svD92962QGiCNxR6cnWN1V1bxGW3Yx";

  $.ajax({
    url: corsAnywhere + yelpAjax,
    method: "GET",
    headers: {
      Authorization: "Bearer " + APIKey
    }
  }).done(function(response) {
    yelpObj[x] = response.businesses[0].url;
  });
}
// $(document).on("click", "button", function () {
//     alert("Hi");
//     var num = $(this).attr("data-id");
//     console.log(num);
//     for (let z = 0; z<results.length;z++){
//         if (num == z){
//             gatherParking(coordinatesArr[z]);

//         }
//     }
// })

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

    contentString =
      "<a target='_blank' href=http://www.google.com/search?q=" +
      nameArr[k].replace(/ /g, "+") +
      ">" +
      nameArr[k] +
      "</a>" +
      "<br>" +
      addressArr[k] +
      "<br>" +
      cityArr[k];
    var infowindows = new google.maps.InfoWindow();
    google.maps.event.addListener(
      venueMarker,
      "click",
      (function(venueMarker, contentString, infowindows) {
        return function() {
          map.setCenter(venueMarker.getPosition());
          infowindows.setContent(contentString);
          infowindows.open(map, venueMarker);
        };
      })(venueMarker, contentString, infowindows)
    );
  }
  map.setZoom(14);
}
function clearVenues() {
  for (var e = 0; e < venueMarkerArr.length; e++) {
    venueMarkerArr[e].setMap(null);
  }
  venueMarkerArr.length = 0;
  venueMarkerArr = [];
  NameArr = [];
  AddressArr = [];
  latArr = [];
  lngArr = [];
}
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

function plotParking() {
  var parkingMarker;
  var parkingString;
  var iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
  var icons = {
    parking: {
      icon: iconBase + "parking_lot_maps.png"
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

    parkingString =
      "<a target='_blank' href=http://www.google.com/search?q=" +
      pNameArr[m].replace(/ /g, "+") +
      ">" +
      pNameArr[m] +
      "</a>" +
      "<br>" +
      pAddressArr[m];
    var infowindows = new google.maps.InfoWindow();
    google.maps.event.addListener(
      parkingMarker,
      "click",
      (function(parkingMarker, parkingString, infowindows) {
        return function() {
          infowindows.setContent(parkingString);
          infowindows.open(map, parkingMarker);
        };
      })(parkingMarker, parkingString, infowindows)
    );
  }
  console.log(pLatArr);
  // map.setZoom(14);
  console.log(parkingMarkers);
}

var pNameArr = [];
var pAddressArr = [];
var pLatArr = [];
var pLngArr = [];

function gatherParking(coordinates) {
  var corsAnywhere = "https://cors-anywhere.herokuapp.com/";
  var nearbyParking =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?rankby=distance&type=parking&key=AIzaSyC6MpLf9jjhgCPBWJcpnqmIu2cZ21fsS8g&";

  nearbyParking += $.param({
    location: coordinates
  });

  $.ajax({
    url: corsAnywhere + nearbyParking,
    method: "GET"
  }).done(function(response) {
    console.log(response.results.length);
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

function gatherParkingLoc() {
  for (let j = 0; j < pAddressArr.length; j++) {
    var plot =
      "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyC6MpLf9jjhgCPBWJcpnqmIu2cZ21fsS8g&";

    plot += $.param({
      address: pAddressArr[j]
    });
    console.log(plot);

    $.ajax({
      url: plot,
      method: "GET"
    }).done(function(response) {
      // console.log(j);
      // console.log(response);
      // console.log(response.results[0]);
      pLatArr.push(response.results[0].geometry.location.lat);
      pLngArr.push(response.results[0].geometry.location.lng);
      plotParking();
    });
  }
}
