// Obtain the data from the URL with d3.json
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){createFeatures(data.features)});

// Streetmap and satellite map layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFybG9uNjU5OCIsImEiOiJjbGhkeHBjNzUxZnBnM3RvYWZwa2Jic3UwIn0.siAidtSwkUlLN0W689qTdg",{
    tileSize: 512, zoomOffset: -1,});

var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFybG9uNjU5OCIsImEiOiJjbGhkeHBjNzUxZnBnM3RvYWZwa2Jic3UwIn0.siAidtSwkUlLN0W689qTdg",{
    tileSize: 512, zoomOffset: -1,});

// Variable that contains the two map layers
var maps = {"Street Map": streetmap, "Satellite": satellite};

// Function that identifies the colors of our markers
function markerColors(magnitude){
    if (magnitude <= 1)
        return "#a6d96a"
    else if (magnitude <= 2)
        return "#d9ef8b"
    else if (magnitude <= 3)
        return "#fee08b"
    else if (magnitude <= 4)
        return "#fdae61"
    else if (magnitude <= 5)
        return "#f46d43"
    else
    return "#d73027"
};

// Function that gives each feature a popup, which describes the place, time, and size of the earthquake
function createFeatures(earthquakeData){
    function onEachFeature(feature, layer)
        {layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "</h3><hr><p>" + "<b>Magnitude: </b>" + (feature.properties.mag) + "</p>")};

    var earthquakes = L.geoJSON(earthquakeData,{
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng,{
                radius: markerSize(feature.properties.mag),
                fillColor: markerColors(feature.properties.mag),
                color: "#000000",
                weight: 0.4,
                opacity: 1,
                fillOpacity: 1  
            });
        },
    onEachFeature: onEachFeature
    });
    // Resizes markers to readable size
    function markerSize(magnitude){return magnitude * 5};

    createMap(earthquakes);
};

// Create interactive map
function createMap(earthquakes)
{
    var myMap = L.map("map",{
        center: [38, -95.7],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Control layer group that allows user to change map layer and to show & hide earthquake data
    L.control.layers(maps, {Earthquakes: earthquakes}, {collapsed: false}).addTo(myMap);

    // Legend that shows which color represents which level of magnitude
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function(map){
        var div = L.DomUtil.create("div", "info legend");
        magnitudes = [0, 1, 2, 3, 4, 5];
        labels = [""];
        div.innerHTML = "Earthquake<br>Magnitudes";

        // Labels for legend
        for (var i = 0; i < magnitudes.length; i++){
            labels.push("<li style=background-color:" + markerColors(magnitudes[i] + 1) +
            "><span>" + magnitudes[i] + (magnitudes[i + 1] ? " - " + magnitudes[i + 1] + "":"+") + "</span></li>")};

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        // Background box for legend
        div.style.backgroundColor = "#ffffff";
        div.style.padding = "10px";
        div.style.borderRadius = "5px";
        div.style.boxShadow = "0 2px 3px rgba(0, 0, 0, 0.5)";
        return div;      
    };
    
    legend.addTo(myMap);
};