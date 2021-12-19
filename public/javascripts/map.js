mapboxgl.accessToken = 'pk.eyJ1Ijoia3VuYWxhaHVqYSIsImEiOiJja3RlaWM0dGgwemhiMnFyd2IzNnhzMnNiIn0.CiWMQyk0mh9mMePYQ7Dx_g';

const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 10 // starting zoom
});

 new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map);