/**
 * Created by LobanovI on 06.09.2016.
 */

require('leaflet/dist/leaflet.css');
require('leaflet-draw/dist/leaflet.draw.css');
var iconMarker = require('leaflet/dist/images/marker-icon.png');
var shadowMarker = require('leaflet/dist/images/marker-shadow.png');
require('./styles.css');
require('leaflet/dist/leaflet.js');
require('leaflet-draw/dist/leaflet.draw.js');
var buffer = require('../index');

module.exports = Drawings;

var Drawings = function () {
};

Drawings.prototype.init = function () {
    this.initMap();
    this.initLayer();
    this.initTools();
};


Drawings.prototype.initMap = function () {
    this.map = new L.Map('map').setView([55.752012, 37.616578], 13);
};
Drawings.prototype.initLayer = function () {
    if (this.map) {
        this.tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }
};
Drawings.prototype.initTools = function () {
    if (this.map) {
        this.layer = new L.FeatureGroup();
        this.toolbar = new L.Control.Draw({
            position: 'topleft',
            draw: {
                polyline: {
                    shapeOptions: {
                        color: '#000000',
                        weight: 2
                    }
                },
                marker: {
                    icon: new L.Icon.Default({
                        iconUrl: iconMarker,
                        shadowUrl: shadowMarker
                    })
                },
                circle: false,
                polygon: false,
                rectangle: false
            },
            edit: {
                featureGroup: this.layer
            }
        });
        this.map.addControl(this.toolbar);
        this.map.on('draw:created', function (e) {
            var result = buffer(e.layer.toGeoJSON(), 20, 'meters');
            this.layer.addLayer(e.layer);
            this.layer.addLayer(L.GeoJSON.geometryToLayer(result));
            this.layer.addTo(this.map);
        }, this);
    }
};

new Drawings().init();