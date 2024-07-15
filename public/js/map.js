mapboxgl.accessToken=mapToken; 
//mapboxgl.accessToken = 'pk.eyJ1IjoiYXJrYXByYWJoYWJpc3dhczQiLCJhIjoiY2x5ZzZlMGpyMDNvajJscXpmOTNtbjl4ZCJ9.7xRGl9qiv9PBFKtNvtRaWw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center:coordinates,// OPPOSITE! longitude first then latitude
    zoom: 7 // starting zoom
});
// const coordinates = JSON.parse(window.listingCoordinates); 
    console.log("OK--->",coordinates);

   // Create a default Marker and add it to the map.
   const marker1 = new mapboxgl.Marker({color:"red"})
   .setLngLat(coordinates)              //([88.3629,22.5744])
   .setPopup(new mapboxgl.Popup({offset:25}).setHTML("<h3>Welcome to Wanderlust!</h3>"))                       
   .addTo(map);
