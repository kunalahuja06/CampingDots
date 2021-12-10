mapboxgl.accessToken = 'pk.eyJ1Ijoia3VuYWxhaHVqYSIsImEiOiJja3RlaWM0dGgwemhiMnFyd2IzNnhzMnNiIn0.CiWMQyk0mh9mMePYQ7Dx_g';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: [-74.5, 40], // starting position [lng, lat]
zoom: 10 // starting zoom
});

new mapboxgl.marker()
    .setLngLat([-74.5,40])
    .Popup(
        new mapboxgl.Popup({offfset:25})
        .setHTML(
            `<h3>${campground.title}</h3>`
        )
    )
    .addTo(map)