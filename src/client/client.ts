/**
 * Created by LobanovI on 06.09.2016.
 */
///<reference path="../../typings/index.d.ts"/>
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import iconMarker = require('leaflet/dist/images/marker-icon.png');
import shadowMarker = require('leaflet/dist/images/marker-shadow.png');
import './styles.css';
import 'leaflet/dist/leaflet.js';
import 'leaflet-draw/dist/leaflet.draw.js';
import {LeafletHelper} from '../helpers';
import {LineBuffer, PointBuffer} from '../index';

export class Drawings {
    public map: L.Map;
    public tileLayer: L.TileLayer;
    public layer: L.FeatureGroup<L.ILayer>;
    public helper: LeafletHelper;
    public lineBuffer: LineBuffer;
    public pointBuffer: PointBuffer;
    public toolbar: any;
    constructor(helper: any, pBuffer: any, lBuffer: any) {
        this.helper = helper;
        this.pointBuffer = pBuffer;
        this.lineBuffer = lBuffer;
    }

    init() {
        this.initMap();
        this.initLayer();
        this.initTools();
    }

    initMap() {
        this.map = new L.Map('map').setView([55.752012, 37.616578], 13);
    }
    initLayer() {
        if(this.map) {
            this.tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
        }
    }
    initTools() {
        if(this.map) {
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
            this.map.on('draw:created', (e: {layer: L.ILayer}) => {
                let buffer;
               this.layer.addLayer(e.layer).addTo(this.map);
               let helper = new this.helper(e.layer, this.map.getZoom());
                if(e.layer instanceof L.Polyline) {
                    buffer = new this.lineBuffer(helper.toPixels());
                } else {
                    buffer = new this.pointBuffer(helper.toPixels());
                }

               this.layer.addLayer(helper.fromPixels(buffer.calculate(100)))
            });
        }
    }

}

new Drawings(LeafletHelper, PointBuffer, LineBuffer).init();