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

      let legend = L.control({
        position: "bottomright"
      });
      legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = [
          "#98EE00",
          "#D4EE00",
          "#EECC00",
          "#EE9C00",
          "#EA822C",
          "#EA2C2C"];
        // Loop through our intervals and generate a label with a colored square for each interval.
        for (let i = 0; i < grades.length; i++) {
          div.innerHTML += "<i style='background: "
            + colors[i]
            + "'></i> "
            + grades[i]
            + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
      };
      // We add our legend to the map.
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
  document.addEventListener("DOMContentLoaded", initMap)






