import './styles.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Map, featureGroup, Control, Icon, GeoJSON, tileLayer } from 'leaflet';
import 'leaflet-draw';
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import shadowMarker from 'leaflet/dist/images/marker-shadow.png';
import buffer from 'buffer';

export default (function() {
  const map = new Map('map').setView([55.752012, 37.616578], 13);

  tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const layer = featureGroup();
  const toolbar = new Control.Draw({
    position: 'topleft',
    draw: {
      polyline: {
        shapeOptions: {
          color: '#000000',
          weight: 2
        }
      },
      marker: {
        icon: new Icon.Default({
          iconUrl: iconMarker,
          shadowUrl: shadowMarker
        })
      },
      circle: false,
      polygon: false,
      rectangle: false
    },
    edit: {
      featureGroup: layer
    }
  });
  map.addControl(toolbar);
  map.on('draw:created', function(e) {
    const radius = +prompt('Please, enter buffer radius in meters', 20);
    if (radius && radius > 0) {
      const geojson = e.layer.toGeoJSON();
      console.log(geojson);
      const result = buffer(geojson, radius);
      layer.addLayer(GeoJSON.geometryToLayer(result).bindPopup(`Radius: ${radius} meters`));
    }
    layer.addLayer(e.layer);
    layer.addTo(map);
  });
})();
