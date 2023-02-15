

// Creating the map object
var myMap = L.map("map", {
    center: [ 45.52, -122.67],
    zoom: 5
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);


var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Depth<br>(percentile)</br></h4>";

  div.innerHTML += '<i style="background: #08306b"></i><span>>80</span><br>';
  div.innerHTML += '<i style="background: #08519c"></i><span>70-80</span><br>';
  div.innerHTML += '<i style="background: #2171b5"></i><span>60-70</span><br>';
  div.innerHTML += '<i style="background: #4292c6"></i><span>50-60</span><br>';
  div.innerHTML += '<i style="background: #6baed6"></i><span>40-50</span><br>';
  div.innerHTML += '<i style="background: #9ecae1"></i><span>30-40</span><br>';
  div.innerHTML += '<i style="background: #c6dbef"></i><span>20-30</span><br>';
  div.innerHTML += '<i style="background: #deebf7"></i><span>10-20</span><br>';
  div.innerHTML += '<i style="background: #f7fbff"></i><span><10</span><br>';

  //div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Grænse</span><br>';
  return div;
};

legend.addTo(myMap);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

  function mag_percentile_finder( features, percentile ) {
    var sorted_array = [];
    for (var i = 0; i < features.length; i++) {
        sorted_array.push(features[i].properties.mag);
    }
    sorted_array.sort((firstNum, secondNum) => firstNum - secondNum);

    let array_length = sorted_array.length;
    let percentile_index = Math.floor( array_length * percentile ) - 1;
    sorted_array[ percentile_index ];

    return sorted_array[ percentile_index ]
  };

  function coordinate_percentile_finder( features, percentile ) {
    var sorted_array = [];

    for (var i = 0; i < features.length; i++) {
        sorted_array.push(features[i].geometry.coordinates[2]);
    }

    sorted_array.sort((firstNum, secondNum) => firstNum - secondNum);

    let array_length = sorted_array.length;
    let percentile_index = Math.floor( array_length * percentile ) - 1;
    sorted_array[ percentile_index ];

    return sorted_array[ percentile_index ]
  };


  d3.json(link).then(function(data) {
        // Creating a GeoJSON layer with the retrieved data
        console.log(data.features[0].properties.mag);
        console.log(data.features[0].geometry.coordinates.slice(0,2).reverse());
        console.log(data.features[0].geometry.coordinates[2]);

        //let  features_mag_perc = mag_percentile_finder( data.features, 0.3 );
        //console.log( features_mag_perc ); 
        //console.log( features_mag.length ); 

        //console.log(features.map(feature => feature.proporties.mag));

        for (var i = 0; i < data.features.length; i++) {
        var depth = "";
                if (data.features[i].properties.mag > mag_percentile_finder( data.features, 0.9 )) {
                    depth = 22;
                }
                else if (data.features[i].properties.mag>  mag_percentile_finder( data.features, 0.8 )) {
                    depth = 20;
                }
                else if (data.features[i].properties.mag>  mag_percentile_finder( data.features, 0.7 )) {
                    depth = 18;
                }
                else if (data.features[i].properties.mag > mag_percentile_finder( data.features, 0.6 )) {
                    depth = 16;
                }
                 else if (data.features[i].properties.mag > mag_percentile_finder( data.features, 0.5 ) ){
                    depth = 14;
                 }
                 else if (data.features[i].properties.mag> mag_percentile_finder( data.features, 0.4 )) {
                    depth = 12;
                }
                 else if (data.features[i].properties.mag > mag_percentile_finder( data.features, 0.3 )) {
                    depth = 10;
                }
                else if (data.features[i].properties.mag > mag_percentile_finder( data.features, 0.2 )) {
                    depth = 8;
                }
                 else if (data.features[i].properties.mag > mag_percentile_finder( data.features, 0.1 )) {
                    depth = 6;
                 }
                else {
                    depth = 4;
                }    

                var color = "";

                if (data.features[i].geometry.coordinates[2] > coordinate_percentile_finder( data.features, 0.80 )) {
                  color = "#08306b";
                }
                else if (data.features[i].geometry.coordinates[2]> coordinate_percentile_finder( data.features, 0.70 )) {
                  color = "#08519c";
                }
                else if (data.features[i].geometry.coordinates[2] > coordinate_percentile_finder( data.features, 0.60 )) {
                  color = "#2171b5";
                }
                 else if (data.features[i].geometry.coordinates[2] > coordinate_percentile_finder( data.features, 0.50 )) {
                 color = "#4292c6";
                 }
                 else if (data.features[i].geometry.coordinates[2]> coordinate_percentile_finder( data.features, 0.40 )) {
                    color = "#6baed6";
                }
                 else if (data.features[i].geometry.coordinates[2] > coordinate_percentile_finder( data.features, 0.30 )) {
                        color ="#9ecae1" ;
                }
                else if (data.features[i].geometry.coordinates[2] > coordinate_percentile_finder( data.features, 0.20 )) {
                            color = "#c6dbef";
                }
                 else if (data.features[i].geometry.coordinates[2] > coordinate_percentile_finder( data.features, 0.10 )) {
                                color = "#deebf7";
                 }
                else {
                  color = "#f7fbff";
                }    

                var circleMarkerOptions = {
                    radius: depth,
                    fillColor: color,
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                };

                L.circleMarker(data.features[i].geometry.coordinates.slice(0,2).reverse(), circleMarkerOptions).bindPopup(`<h3>Location : ${data.features[i].properties.title}</h3><hr><p>Magnitude: ${data.features[i].properties.mag}</p><p>Depth: ${data.features[i].geometry.coordinates[2]}</p>`).addTo(myMap);
                

        }});



        // var legend = L.control({position: 'bottomleft'});
     





    