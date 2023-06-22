function initMap() {
    // Define the map center and zoom level
    var mapCenter = [37.7749, -122.4194]; // San Francisco
    var mapZoom = 5;
  
    // Create the map object
    var map = L.map('map').setView(mapCenter, mapZoom);
  
    // Add the tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    // Create a marker cluster group
    var markerCluster = L.markerClusterGroup();
  
    // Fetch earthquake data from the URL
    var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Retrieve the earthquake features
        var earthquakeData = data.features;
  
        // Iterate over the earthquake data and create markers
        earthquakeData.forEach(function (feature) {
          // Extract earthquake properties
          var properties = feature.properties;
          var magnitude = properties.mag;
          var depth = feature.geometry.coordinates[2];
  
          // Define the marker size and color based on magnitude and depth
          var markerSize = magnitude * 5; // Adjust scaling factor as desired
          var markerColor = getColor(depth);
  
          // Create the marker and bind a popup
          var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: markerSize,
            color: "#000",
            weight: 2, // Adjust thickness of the circle border
            fillColor: markerColor,
            fillOpacity: 0.7
          }).bindPopup(
            // Create the popup content
            "<b>Magnitude:</b> " + magnitude + "<br>" +
            "<b>Depth:</b> " + depth
          );
  
          // Add the marker to the marker cluster group
          markerCluster.addLayer(marker);
        });
  
        // Add the marker cluster group to the map
        map.addLayer(markerCluster);
  
        // Add a scale control to the map
        L.control.scale().addTo(map);
  
        // Add a legend to the map
        var legend = L.control({ position: "bottomright" });
        legend.onAdd = function (map) {
          var div = L.DomUtil.create("div", "legend");
          div.innerHTML += "<h4>Richter Scale</h4>";
          div.innerHTML += '<i style="background: #00FF00"></i> <span>0 - 10</span><br>';
          div.innerHTML += '<i style="background: #FFFF00"></i> <span>10 - 30</span><br>';
          div.innerHTML += '<i style="background: #FFA500"></i> <span>30 - 50</span><br>';
          div.innerHTML += '<i style="background: #FF0000"></i> <span>50+</span><br>';
          return div;
        };
        legend.addTo(map);
      })
      .catch(function (error) {
        console.log("Error fetching earthquake data:", error);
      });
  
    // Define the getColor function to determine marker color based on depth
    function getColor(depth) {
      var color;
  
      // Determine depth color
      if (depth < 10) {
        color = "#00FF00"; // Green (shallow)
      } else if (depth < 30) {
        color = "#FFFF00"; // Yellow (intermediate)
      } else if (depth < 50) {
        color = "#FFA500"; // Orange (deep)
      } else {
        color = "#FF0000"; // Red (very deep)
      }
  
      return color;
    }
  }
  
  // Call the initMap function when the DOM is ready
  document.addEventListener("DOMContentLoaded", initMap);






