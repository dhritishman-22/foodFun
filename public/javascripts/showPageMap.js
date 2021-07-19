mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
	center: eatery.geometry.coordinates, // starting position [lng, lat]
	zoom: 9 // starting zoom
});

new mapboxgl.Marker()
	.setLngLat(eatery.geometry.coordinates)
	.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${eatery.title}</h3><p>${eatery.location}</p>`))
	.addTo(map);
